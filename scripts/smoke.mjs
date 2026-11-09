import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const base = process.env.DEPLOY_URL ?? "http://127.0.0.1:18210";
const password = process.env.DEPLOY_DEMO_PASSWORD;
assert.ok(password, "Load DEPLOY_DEMO_PASSWORD from the deployment credentials");
const [mode = "workflow", artifact] = process.argv.slice(2);
assert.ok(["workflow", "verify"].includes(mode), "Expected workflow or verify");
if (mode === "verify") assert.ok(artifact, "Pass the workflow evidence file to verify");
const sessions = [];
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aK1sAAAAASUVORK5CYII=",
  "base64",
);

async function api(method, path, { session, body, expected = 200, binary = false } = {}) {
  const headers = {};
  if (session) headers.Authorization = `Bearer ${session.accessToken}`;
  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }
  const response = await fetch(`${base}/api/v1${path}`, {
    method,
    headers,
    body,
    signal: AbortSignal.timeout(15_000),
  });
  assert.equal(response.status, expected, `${method} ${path}`);
  if (expected === 204 || expected >= 400) return;
  if (binary) return Buffer.from(await response.arrayBuffer());
  return (await response.json()).data;
}

async function login(username) {
  const session = await api("POST", "/auth/login", {
    body: { login: username, password, deviceName: "Deployment smoke" },
  });
  assert.equal(session.user.username, username);
  sessions.push(session);
  return session;
}

async function verifyClosed(requester, { requestId, fileId }) {
  const detail = await api("GET", `/service-requests/${requestId}`, { session: requester });
  assert.equal(detail.status, "CLOSED");
  assert.ok(detail.attachments.some((attachment) => attachment.fileId === fileId));
  const restored = await api("GET", `/files/${fileId}/download`, {
    session: requester,
    binary: true,
  });
  assert.deepEqual(restored, png);
}

async function workflow(requester) {
  const manager = await login("hung.it");
  const handler = await login("hai.it");
  const { categories } = await api("GET", "/workplace/context", { session: requester });
  const category = categories.find(({ code }) => code === "IT_SUPPORT");
  assert.ok(category, "IT demo route exists");
  await api("GET", "/workplace/staff", { session: requester, expected: 403 });

  const form = new FormData();
  form.set("file", new Blob([png], { type: "image/png" }), "deployment-smoke.png");
  form.set("purpose", "SERVICE_ATTACHMENT");
  const file = await api("POST", "/files", { session: requester, body: form, expected: 201 });
  const created = await api("POST", "/service-requests", {
    session: requester,
    expected: 201,
    body: {
      categoryId: category.id,
      title: `Deployment smoke ${randomUUID()}`,
      description: "Synthetic request for deployment verification",
      priority: "MEDIUM",
      attachmentFileIds: [file.id],
    },
  });
  const path = `/service-requests/${created.id}`;
  const open = await api("GET", path, { session: manager });
  assert.equal(open.status, "OPEN");
  await api("POST", `${path}/assignments`, {
    session: manager,
    body: { assigneeId: handler.user.id, version: open.version },
  });
  const assigned = await api("GET", path, { session: handler });
  assert.equal(assigned.assignee.id, handler.user.id);

  for (const [status, session, comment] of [
    ["IN_PROGRESS", handler, undefined],
    ["RESOLVED", handler, "Synthetic resolution"],
    ["CLOSED", requester, undefined],
  ]) {
    const { version } = await api("GET", path, { session });
    await api("PUT", `${path}/status`, { session, body: { status, version, comment } });
    assert.equal((await api("GET", path, { session })).status, status);
  }

  return { requestId: created.id, fileId: file.id, status: "CLOSED" };
}

const home = await fetch(base, { signal: AbortSignal.timeout(10_000) });
assert.equal(home.status, 200);
assert.match(await home.text(), /WorkSphere/i);
await api("GET", "/workplace/context", { expected: 401 });
try {
  const requester = await login("minh.kd");
  const evidence = mode === "workflow"
    ? await workflow(requester)
    : JSON.parse(await readFile(artifact, "utf8"));
  await verifyClosed(requester, evidence);
  if (mode === "workflow" && artifact) {
    await writeFile(artifact, JSON.stringify(evidence, null, 2) + "\n");
  }
  console.log(`WorkSphere smoke ${mode}: PASS (request and attachment verified)`);
} finally {
  await Promise.all(sessions.map(async (session) => {
    await api("POST", "/auth/logout", {
      session,
      body: { refreshToken: session.refreshToken },
      expected: 204,
    });
    await api("GET", "/workplace/context", { session, expected: 401 });
  }));
}
