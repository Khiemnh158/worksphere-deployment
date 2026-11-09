FROM docker:29-cli@sha256:2357639ad1ea7d0194134bf3292622fd4e562483966ed674e5d7c945b5f3b28d AS docker
FROM node:24-bookworm-slim@sha256:01d566e8d94d8c619591d78652babfccd3c6992a3dffa9ed5ab39e11cf6c70e9 AS node
FROM jenkins/inbound-agent:jdk21@sha256:0c5908a376ff73381f3617c8277b77559a9c8916fe0c22efd9b9e9ef326aeb27
USER root
RUN apt-get update && apt-get install -y --no-install-recommends unzip \
    && rm -rf /var/lib/apt/lists/* \
    && install -d -o jenkins -g jenkins /home/jenkins/.m2
COPY --from=docker /usr/local/bin/docker /usr/local/bin/docker
COPY --from=docker /usr/local/libexec/docker/cli-plugins/ /usr/local/libexec/docker/cli-plugins/
COPY --from=node /usr/local/bin/node /usr/local/bin/node
USER jenkins
