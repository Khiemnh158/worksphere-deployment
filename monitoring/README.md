# Prometheus config và dashboard Grafana

[compose.yaml](compose.yaml) build hai image có cấu hình sẵn. Prometheus scrape `api:9091/actuator/prometheus`. Grafana đọc Prometheus và nạp dashboard WorkSphere API. Xem [runbook](../runbooks/LOCAL.md#prometheus-và-grafana).
