#!/bin/bash
# AuraForecasting Monitoring Stack Deployment Script
# Deploys Prometheus and Grafana for monitoring the Aura application

set -e

NAMESPACE="monitoring"

echo "🚀 Starting AuraForecasting Monitoring Stack Deployment..."

# Step 1: Check if Minikube is running
echo "📋 Checking Minikube status..."
if ! minikube status > /dev/null 2>&1; then
    echo "❌ Minikube is not running. Starting Minikube..."
    minikube start --memory=4096 --cpus=2
else
    echo "✅ Minikube is already running"
fi

# Step 2: Create namespace
echo "📦 Creating monitoring namespace..."
kubectl apply -f namespace.yaml

# Step 3: Apply Prometheus ConfigMap
echo "⚙️  Applying Prometheus ConfigMap..."
kubectl apply -f prometheus-configmap.yaml

# Step 4: Apply Prometheus Alerts ConfigMap
echo "🔔 Applying Prometheus Alerts..."
kubectl apply -f prometheus-alerts.yaml

# Step 5: Apply Prometheus Deployment and Service
echo "📈 Applying Prometheus Deployment..."
kubectl apply -f prometheus-deployment.yaml

# Step 6: Apply Grafana ConfigMaps
echo "📊 Applying Grafana ConfigMaps..."
kubectl apply -f grafana-configmap.yaml
kubectl apply -f grafana-datasources.yaml
kubectl apply -f grafana-dashboard-configmap.yaml
kubectl apply -f grafana-dashboard-provisioning.yaml

# Step 7: Apply Grafana Deployment and Service
echo "📉 Applying Grafana Deployment..."
kubectl apply -f grafana-deployment.yaml

# Step 8: Wait for deployments
echo "⏳ Waiting for Prometheus deployment..."
kubectl rollout status deployment/prometheus -n $NAMESPACE --timeout=120s

echo "⏳ Waiting for Grafana deployment..."
kubectl rollout status deployment/grafana -n $NAMESPACE --timeout=120s

# Step 9: Print access information
echo ""
echo "✅ Monitoring Stack Deployment Complete!"
echo ""
echo "📍 Access Monitoring Services:"
echo "   - Prometheus: http://$(minikube ip):30090"
echo "   - Grafana:    http://$(minikube ip):30030"
echo ""
echo "🔐 Grafana Credentials:"
echo "   - Username: admin"
echo "   - Password: admin123"
echo ""
echo "📊 Useful commands:"
echo "   - kubectl get pods -n $NAMESPACE"
echo "   - kubectl get svc -n $NAMESPACE"
echo "   - kubectl logs -l app=prometheus -n $NAMESPACE"
echo "   - kubectl logs -l app=grafana -n $NAMESPACE"
echo "   - minikube service prometheus -n $NAMESPACE --url"
echo "   - minikube service grafana -n $NAMESPACE --url"
echo "   - minikube dashboard"
