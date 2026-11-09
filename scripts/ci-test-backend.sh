#!/usr/bin/env bash
set -euo pipefail

test_db="worksphere-ci-test-$(node -p 'require("node:crypto").randomBytes(6).toString("hex")')"
export POSTGRES_PASSWORD
POSTGRES_PASSWORD=$(node -p 'require("node:crypto").randomBytes(24).toString("hex")')

docker run --rm --detach --name "$test_db" \
    --network "${WORKSPHERE_CI_NETWORK:?Set the isolated CI Docker network}" \
    -e POSTGRES_PASSWORD -e POSTGRES_DB=worksphere_test \
    postgres:15-alpine@sha256:54e0dd8e8cddcdbb9156c2486eed5a43eccb7214d7c6828097d41ce049fb3984 >/dev/null
trap 'docker stop "$test_db" >/dev/null' EXIT

ready=false
for attempt in {1..40}; do
    if docker exec "$test_db" pg_isready -h 127.0.0.1 -U postgres -d worksphere_test >/dev/null; then
        ready=true
        break
    fi
    sleep 1
done
if [[ "$ready" != true ]]; then
    echo "Test database did not become ready" >&2
    exit 1
fi

export WORKSPHERE_AUTHZ_TEST_JDBC_URL="jdbc:postgresql://$test_db:5432/worksphere_test"
export WORKSPHERE_AUTHZ_TEST_DB_USER=postgres
export WORKSPHERE_AUTHZ_TEST_DB_PASSWORD="$POSTGRES_PASSWORD"
export JAVA_TOOL_OPTIONS="-Xmx1024m -XX:ActiveProcessorCount=4"
cd app/backend
./mvnw -B clean \
    org.jacoco:jacoco-maven-plugin:0.8.14:prepare-agent \
    verify org.jacoco:jacoco-maven-plugin:0.8.14:report
