#!/bin/bash
# AuraForecasting Minikube Undeployment Script
# Run this script to remove Aura from Minikube

set -e

NAMESPACE="aura-forecasting"

echo "🗑️  Starting AuraForecasting Undeployment..."

# Delete all resources in namespace
echo "📦 Deleting namespace and all resources..."
kubectl delete namespace $NAMESPACE --ignore-not-found=true

echo ""
echo "✅ Undeployment Complete!"
echo ""
echo "💡 To redeploy, run: ./deploy.sh"
