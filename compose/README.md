# Compose local/monitoring và public override

[compose.yaml](compose.yaml) chạy Nginx, Spring Boot và PostgreSQL trên mạng riêng. Web chỉ bind localhost. DB, uploads và mailbox có volume riêng. Dùng [runbook](../runbooks/LOCAL.md#docker-compose) để chạy và kiểm tra.
