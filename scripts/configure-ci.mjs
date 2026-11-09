import { randomBytes } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import { parseEnv } from "node:util";

const file = new URL("../.env.ci", import.meta.url);
const temp = new URL("../.env.ci.new", import.meta.url);
const random = () => randomBytes(24).toString("hex");
const command = process.argv[2];
const sonar = "http://127.0.0.1:19000";
const jenkins = "http://127.0.0.1:18081";
const mainProject = "worksphere-deployment";
const rejectionProject = "worksphere-rejection-check";
const rejectionGate = "WorkSphere deliberate rejection";

async function prepare() {
  const branch = process.argv[3] ?? "main";
  if (!/^[a-zA-Z0-9_./-]+$/.test(branch)) throw new Error("Invalid deployment branch");
  const entries = {
    DEPLOYMENT_BRANCH: branch,
    SONAR_DB_PASSWORD: random(),
    SONAR_ADMIN_PASSWORD: "Ws9!" + random(),
    SONAR_WEBHOOK_SECRET: random(),
    JENKINS_LOCAL_PASSWORD: random(),
    GRAFANA_ADMIN_PASSWORD: random(),
  };
  try {
    await writeFile(file, asEnv(entries), { flag: "wx", mode: 0o600 });
    console.log("Created .env.ci");
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    console.log("Kept existing .env.ci");
  }
}

function asEnv(entries) {
  return Object.entries(entries).map(([key, value]) => `${key}=${value}\n`).join("");
}

async function save(entries) {
  await writeFile(temp, asEnv(entries), { mode: 0o600 });
  await rename(temp, file);
}

function basic(user, password) {
  return "Basic " + Buffer.from(`${user}:${password}`).toString("base64");
}

async function sonarApi(path, authorization, fields) {
  const response = await fetch(sonar + path, {
    method: fields ? "POST" : "GET",
    headers: { Authorization: authorization },
    body: fields ? new URLSearchParams(fields) : undefined,
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`SonarQube ${path} returned ${response.status}`);
  if (response.status === 204) return;
  const result = await response.text();
  return result ? JSON.parse(result) : undefined;
}

async function configureSonar(entries) {
  const auth = basic("admin", entries.SONAR_ADMIN_PASSWORD);
  if (!(await sonarApi("/api/authentication/validate", auth)).valid) {
    await sonarApi("/api/users/change_password", basic("admin", "admin"), {
      login: "admin",
      previousPassword: "admin",
      password: entries.SONAR_ADMIN_PASSWORD,
    });
  }

  for (const key of [mainProject, rejectionProject]) {
    const result = await sonarApi(`/api/projects/search?projects=${key}`, auth);
    if (!result.components.some((project) => project.key === key)) {
      await sonarApi("/api/projects/create", auth, {
        project: key,
        name: key,
        visibility: "private",
      });
    }
    const { webhooks } = await sonarApi(`/api/webhooks/list?project=${key}`, auth);
    if (!webhooks.some((hook) => hook.name === "WorkSphere Jenkins")) {
      await sonarApi("/api/webhooks/create", auth, {
        project: key,
        name: "WorkSphere Jenkins",
        url: "http://jenkins:8080/sonarqube-webhook/",
        secret: entries.SONAR_WEBHOOK_SECRET,
      });
    }
  }

  const { qualitygates } = await sonarApi("/api/qualitygates/list", auth);
  if (!qualitygates.some((gate) => gate.name === rejectionGate)) {
    await sonarApi("/api/qualitygates/create", auth, { name: rejectionGate });
  }
  const gate = await sonarApi(`/api/qualitygates/show?name=${encodeURIComponent(rejectionGate)}`, auth);
  if (!gate.conditions.some((condition) => condition.metric === "coverage")) {
    await sonarApi("/api/qualitygates/create_condition", auth, {
      gateName: rejectionGate,
      metric: "coverage",
      op: "LT",
      error: "100",
    });
  }
  await sonarApi("/api/qualitygates/select", auth, {
    gateName: rejectionGate,
    projectKey: rejectionProject,
  });
  if (!entries.SONAR_TOKEN) {
    const token = await sonarApi("/api/user_tokens/generate", auth, {
      name: `worksphere-jenkins-${randomBytes(4).toString("hex")}`,
      type: "GLOBAL_ANALYSIS_TOKEN",
    });
    entries.SONAR_TOKEN = token.token;
    await save(entries);
  }
  console.log("Configured SonarQube projects and Jenkins webhooks");
}

async function configureAgent(entries) {
  const authorization = basic("coursework", entries.JENKINS_LOCAL_PASSWORD);
  const response = await fetch(`${jenkins}/computer/linux-docker/jenkins-agent.jnlp`, {
    headers: { Authorization: authorization },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Jenkins agent endpoint returned ${response.status}`);
  const secret = (await response.text()).match(/<argument>([a-f0-9]{64})<\/argument>/)?.[1];
  if (!secret) throw new Error("Jenkins did not provide the inbound agent secret");
  entries.JENKINS_AGENT_SECRET = secret;
  await save(entries);
  console.log("Configured Jenkins inbound agent");
}

if (command === "prepare") {
  await prepare();
} else {
  const entries = parseEnv(await readFile(file, "utf8"));
  if (command === "sonar") await configureSonar(entries);
  else if (command === "agent") await configureAgent(entries);
  else throw new Error("Use prepare, sonar or agent");
}
