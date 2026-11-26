import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

export async function verifyOpenApi(base, fetcher = fetch) {
  const checks = [];
  async function get(path, expected = 200) {
    const response = await fetcher(`${base}${path}`, {
      signal: AbortSignal.timeout(15_000),
    });
    assert.equal(response.status, expected, `GET ${path}`);
    checks.push({ path, status: response.status });
    return response;
  }
  const page = await get("/swagger-ui/index.html");
  assert.match(await page.text(), /Swagger UI/i);
  const config = await get("/v3/api-docs/swagger-config");
  assert.ok((await config.json()).url, "Swagger points to its API definition");
  const spec = await (await get("/v3/api-docs")).json();
  assert.match(spec.openapi, /^3\./);
  for (const path of ["/api/v1/workplace/work", "/api/v1/workplace/attendance/punches"]) {
    assert.ok(spec.paths[path], `Documented business API ${path}`);
  }
  assert.equal(spec.components.securitySchemes.bearerAuth.scheme, "bearer");
  assert.ok(spec.security.some((item) => Object.hasOwn(item, "bearerAuth")));
  for (const operation of ["login", "refresh", "activate", "forgot-password", "reset-password"]) {
    assert.deepEqual(spec.paths[`/api/v1/auth/${operation}`].post.security, [],
      `Public authentication operation ${operation}`);
  }
  await get("/api/v1/workplace/work", 401);
  return { checkedAt: new Date().toISOString(), baseUrl: base, checks,
    documentedPaths: Object.keys(spec.paths).length, result: "PASS" };
}

if (import.meta.main) {
  const result = await verifyOpenApi(process.env.DEPLOY_URL ?? "http://127.0.0.1:18210");
  if (process.argv[2]) await writeFile(process.argv[2], JSON.stringify(result, null, 2) + "\n");
  console.log(`OpenAPI check: ${result.checks.length} HTTP checks passed; ${result.documentedPaths} paths`);
}
