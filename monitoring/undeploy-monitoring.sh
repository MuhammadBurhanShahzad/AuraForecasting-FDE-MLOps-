#!/bin/bash
# AuraForecasting Monitoring Stack Undeployment Script
# Removes Prometheus and Grafana from the cluster

set -e

NAMESPACE="monitoring"

echo "🗑️  Starting AuraForecasting Monitoring Stack Undeployment..."

# Delete namespace and all resources
echo "📦 Deleting monitoring namespace and all resources..."
kubectl delete namespace $NAMESPACE --ignore-not-found=true

echo ""
echo "✅ Monitoring Stack Undeployment Complete!"
echo ""
echo "💡 To redeploy, run: ./deploy-monitoring.sh"
