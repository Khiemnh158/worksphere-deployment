import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const root = fileURLToPath(new URL("../", import.meta.url));
const { APP_COMMIT: commit } = parseEnv(readFileSync(join(root, "versions.env"), "utf8"));
assert.match(commit, /^[0-9a-f]{40}$/);
const compose = ["compose", "--env-file", "versions.env", "-f", "compose/compose.yaml"];

function docker(args) {
  const result = spawnSync("docker", args, { cwd: root, encoding: "utf8" });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr || `Docker ${args[0]} failed`);
  return result.stdout.trim();
}

function images() {
  return ["api", "web"].map((service) => {
    const container = docker([...compose, "ps", "-q", service]);
    assert.match(container, /^[0-9a-f]{12,64}$/, `Missing running ${service} container`);
    const expected = docker(["image", "inspect", "--format", "{{.Id}}", `worksphere-${service}:${commit}`]);
    const actual = docker(["inspect", "--format", "{{.Image}}", container]);
    return { service, container, expected, actual };
  });
}

let result = images();
const recreated = result.some(({ expected, actual }) => expected !== actual);
if (recreated && process.argv.includes("--repair")) {
  console.log("Recreating API and web to use the images built for this release");
  docker([...compose, "up", "-d", "--no-build", "--no-deps", "--force-recreate", "--wait",
    "--wait-timeout", "180", "api", "web"]);
  result = images();
}
for (const { service, expected, actual } of result) {
  assert.equal(actual, expected, `${service} is running a different image from this release`);
}
const artifact = join(root, "artifacts/runtime-images.json");
mkdirSync(dirname(artifact), { recursive: true });
writeFileSync(artifact, JSON.stringify({ commit, recreated, checkedAt: new Date().toISOString(), images: result }, null, 2) + "\n");
console.log("Running API and web match the release image IDs: PASS");
