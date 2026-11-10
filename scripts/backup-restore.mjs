import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { closeSync, mkdirSync, openSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const root = fileURLToPath(new URL("../", import.meta.url));
const appProject = "worksphere-deployment";
const postgresImage = "postgres:15-alpine@sha256:54e0dd8e8cddcdbb9156c2486eed5a43eccb7214d7c6828097d41ce049fb3984";
const release = parseEnv(readFileSync(join(root, "versions.env"), "utf8"));
const [operation, destination, restoreProject, restorePort = "18211"] = process.argv.slice(2);
assert.ok(["backup", "restore"].includes(operation) && destination,
  "Use backup <new directory> or restore <backup directory> <worksphere-restore-name> [port]");
const folder = resolve(destination);

function docker(args, options = {}) {
  const { input = "ignore", output = "inherit", env = {} } = options;
  const result = spawnSync("docker", args, {
    cwd: root,
    stdio: [input, output, "inherit"],
    encoding: "utf8",
    env: { ...process.env, ...env },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Docker ${args[0]} failed (exit ${result.status})`);
  return result.stdout?.trim();
}

function compose(project, args, options) {
  return docker([
    "compose", "--env-file", "versions.env", "--env-file", ".env.local",
    "-f", "compose/compose.yaml", "-p", project, ...args,
  ], options);
}

function toFile(name, action) {
  const fd = openSync(join(folder, name), "wx", 0o600);
  try { action(fd); } finally { closeSync(fd); }
}

function fromFile(name, action) {
  const fd = openSync(join(folder, name), "r");
  try { action(fd); } finally { closeSync(fd); }
}

function imageId(service) {
  const id = compose(appProject, ["ps", "-q", service], { output: "pipe" });
  assert.ok(id, `Missing running service ${service}`);
  return docker(["inspect", "--format", "{{.Image}}", id], { output: "pipe" });
}

function verifyImage(service, commit, id) {
  const actual = docker(["image", "inspect", "--format", "{{.Id}}", `worksphere-${service}:${commit}`], {
    output: "pipe",
  });
  assert.equal(actual, id, `Expected the recorded ${service} image`);
}

if (operation === "backup") {
  const appCommit = release.APP_COMMIT;
  const images = { api: imageId("api"), web: imageId("web") };
  for (const [service, id] of Object.entries(images)) verifyImage(service, appCommit, id);
  mkdirSync(folder, { mode: 0o700 });
  const startedAt = new Date().toISOString();
  compose(appProject, ["stop", "api"]);
  try {
    toFile("database.dump", (output) => compose(appProject, [
      "exec", "-T", "postgres", "pg_dump", "-U", "worksphere",
      "-d", "worksphere_deployment", "--format=custom", "--no-owner", "--no-acl",
    ], { output }));
    toFile("uploads.tar.gz", (output) => docker([
      "run", "--rm", "--network", "none", "--volume", `${appProject}_uploads:/backup:ro`,
      "--entrypoint", "tar", postgresImage, "-czf", "-", "-C", "/backup", ".",
    ], { output }));
    const manifest = { appCommit, images, startedAt, completedAt: new Date().toISOString() };
    writeFileSync(join(folder, "backup.json"), JSON.stringify(manifest, null, 2) + "\n", {
      flag: "wx", mode: 0o600,
    });
  } finally {
    compose(appProject, ["up", "-d", "--no-build", "--wait", "--wait-timeout", "180", "api"]);
  }
  console.log("Backup created; the deployment API has restarted");
} else {
  assert.match(restoreProject ?? "", /^worksphere-restore-[a-z0-9][a-z0-9-]*$/);
  assert.ok(/^\d+$/.test(restorePort) && +restorePort >= 1024 && +restorePort <= 65535 && +restorePort !== 18210);
  const { appCommit, images } = JSON.parse(readFileSync(join(folder, "backup.json"), "utf8"));
  assert.match(appCommit, /^[0-9a-f]{40}$/);
  for (const service of ["api", "web"]) verifyImage(service, appCommit, images[service]);
  for (const type of ["volume", "network", "container"]) {
    const flags = type === "container" ? "-aq" : "-q";
    const existing = docker([type, "ls", flags, "--filter", `label=com.docker.compose.project=${restoreProject}`], {
      output: "pipe",
    });
    assert.equal(existing, "", `Restore project already owns a ${type}. Choose a fresh name.`);
  }
  const env = { APP_COMMIT: appCommit, DEPLOY_WEB_PORT: restorePort };
  compose(restoreProject, ["create", "--no-build"], { env });
  compose(restoreProject, ["up", "-d", "--wait", "--wait-timeout", "90", "postgres"], { env });
  fromFile("database.dump", (input) => compose(restoreProject, [
    "exec", "-T", "postgres", "pg_restore", "-U", "worksphere",
    "-d", "worksphere_deployment", "--no-owner", "--no-acl", "--single-transaction", "--exit-on-error",
  ], { input, env }));
  fromFile("uploads.tar.gz", (input) => docker([
    "run", "--rm", "-i", "--network", "none", "--volume", `${restoreProject}_uploads:/backup`,
    "--entrypoint", "tar", postgresImage, "-xzf", "-", "-C", "/backup",
  ], { input }));
  compose(restoreProject, ["up", "-d", "--no-build", "--wait", "--wait-timeout", "180"], { env });
  console.log(`Restore started on http://127.0.0.1:${restorePort}`);
}
