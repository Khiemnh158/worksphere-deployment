import assert from "node:assert/strict";
import test from "node:test";
import { verifyOpenApi } from "./verify-openapi.mjs";

function fixture({ schemaStatus = 200, businessStatus = 401 } = {}) {
  const paths = {
    "/api/v1/workplace/work": {},
    "/api/v1/workplace/attendance/punches": {},
  };
  for (const operation of ["login", "refresh", "activate", "forgot-password", "reset-password"]) {
    paths[`/api/v1/auth/${operation}`] = { post: { security: [] } };
  }
  return async (url) => {
    const path = new URL(url).pathname;
    if (path === "/swagger-ui/index.html") return new Response("<title>Swagger UI</title>");
    if (path === "/v3/api-docs/swagger-config") return Response.json({ url: "/v3/api-docs" });
    if (path === "/v3/api-docs") return Response.json({
      openapi: "3.1.0", paths, security: [{ bearerAuth: [] }],
      components: { securitySchemes: { bearerAuth: { scheme: "bearer" } } },
    }, { status: schemaStatus });
    if (path === "/api/v1/workplace/work") return new Response(null, { status: businessStatus });
    throw new Error(`Unexpected fixture request ${path}`);
  };
}

test("requires working UI, schema, JWT contract and protected business data", async () => {
  const result = await verifyOpenApi("http://fixture.invalid", fixture());
  assert.equal(result.result, "PASS");
  assert.equal(result.checks.length, 4);
});

test("rejects the old case where UI works but schema returns 500", async () => {
  await assert.rejects(verifyOpenApi("http://fixture.invalid", fixture({ schemaStatus: 500 })),
    /GET \/v3\/api-docs/);
});

test("rejects accidentally exposing business data without authentication", async () => {
  await assert.rejects(verifyOpenApi("http://fixture.invalid", fixture({ businessStatus: 200 })),
    /GET \/api\/v1\/workplace\/work/);
});
