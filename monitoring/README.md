# AuraForecasting Monitoring Stack

This directory contains the complete monitoring infrastructure for AuraForecasting, including Prometheus for metrics collection and Grafana for visualization.

## Components

| Component | Version | Port | NodePort | Description |
|-----------|---------|------|----------|-------------|
| Prometheus | v2.52.0 | 9090 | 30090 | Metrics collection and alerting |
| Grafana | 10.4.0 | 3000 | 30030 | Metrics visualization and dashboards |

## Quick Start

### Deploy Monitoring Stack

```bash
cd monitoring
chmod +x deploy-monitoring.sh undeploy-monitoring.sh
./deploy-monitoring.sh
```

### Access Services

1. **Prometheus** - Metrics Collection & Querying
   - URL: `http://<minikube-ip>:30090`
   - Use PromQL to query metrics

2. **Grafana** - Dashboards & Visualization
   - URL: `http://<minikube-ip>:30030`
   - Username: `admin`
   - Password: `admin123`
   - Pre-configured with AuraForecasting Overview dashboard

### Undeploy Monitoring Stack

```bash
./undeploy-monitoring.sh
```

## Prometheus Configuration

### Scrape Targets

- **Prometheus itself**: Self-monitoring
- **AuraForecasting pods**: Health endpoint monitoring
- **Kubernetes nodes**: Cluster-level metrics
- **Annotated pods**: Auto-discovery via annotations

### Alerting Rules

| Alert Name | Severity | Description |
|------------|----------|-------------|
| AuraPodDown | Critical | Aura pod is down for more than 1 minute |
| AuraHighMemoryUsage | Warning | Memory usage above 85% for 5 minutes |
| AuraHighCPUUsage | Warning | CPU usage above 80% for 5 minutes |
| AuraPodRestart | Warning | Pod restarted more than 3 times in 1 hour |
| PrometheusDown | Critical | Prometheus instance is down |
| PrometheusTargetScrapeFail | Warning | Scrape target exceeded sample limit |

## Grafana Dashboards

### AuraForecasting Overview

Pre-configured dashboard showing:
- **Running Pods Count**: Number of active Aura pods
- **Average CPU Usage**: Cluster-wide CPU utilization
- **Average Memory Usage**: Cluster-wide memory utilization
- **Pod Restarts (1h)**: Number of restarts in the last hour
- **CPU Usage by Pod**: Time series graph per pod
- **Memory Usage by Pod**: Time series graph per pod

## Metrics Collected

### Kubernetes Metrics
- `container_cpu_usage_seconds_total`
- `container_memory_usage_bytes`
- `kube_pod_container_status_restarts_total`
- `up` (target availability)

### Application Metrics (via /health endpoint)
- Pod availability
- Service health status

## Adding Custom Metrics

To expose custom application metrics:

1. Add Prometheus client to your application
2. Expose `/metrics` endpoint
3. Add annotation to pod:
   ```yaml
   annotations:
     prometheus.io/scrape: "true"
     prometheus.io/port: "8080"
     prometheus.io/path: "/metrics"
   ```

## Resource Requirements

| Component | CPU Request | CPU Limit | Memory Request | Memory Limit |
|-----------|-------------|-----------|----------------|--------------|
| Prometheus | 250m | 1000m | 256Mi | 1Gi |
| Grafana | 250m | 500m | 256Mi | 512Mi |

## Files Structure

```
monitoring/
├── README.md                           # This file
├── namespace.yaml                      # Monitoring namespace
├── prometheus-configmap.yaml           # Prometheus configuration
├── prometheus-alerts.yaml              # Alerting rules
├── prometheus-deployment.yaml          # Prometheus deployment, service, RBAC
├── grafana-configmap.yaml              # Grafana configuration
├── grafana-datasources.yaml            # Prometheus datasource
├── grafana-dashboard-configmap.yaml    # Dashboard JSON definitions
├── grafana-dashboard-provisioning.yaml # Dashboard auto-loading config
├── grafana-deployment.yaml             # Grafana deployment and service
├── deploy-monitoring.sh                # Deployment script
└── undeploy-monitoring.sh              # Undeployment script
```

## Troubleshooting

### Prometheus not scraping targets
```bash
kubectl logs -l app=prometheus -n monitoring
kubectl get servicemonitor -n monitoring
```

### Grafana dashboard not loading
```bash
kubectl logs -l app=grafana -n monitoring
kubectl describe pod -l app=grafana -n monitoring
```

### Check Prometheus targets
Open Prometheus UI and navigate to **Status > Targets** to see scrape target status.

## Integration with AuraForecasting

To enable full application metrics, add the following annotations to the Aura deployment in `k8s/deployment.yaml`:

```yaml
template:
  metadata:
    annotations:
      prometheus.io/scrape: "true"
      prometheus.io/port: "80"
      prometheus.io/path: "/health"
```

---

*Part of AuraForecasting Phase 5: Monitoring Setup*
