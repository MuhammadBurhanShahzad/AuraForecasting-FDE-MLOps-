#!/bin/bash
# AuraForecasting Minikube Deployment Script
# Run this script to deploy Aura to Minikube

set -e

NAMESPACE="aura-forecasting"
IMAGE="burhan107/aura-pro:latest"

echo "🚀 Starting AuraForecasting Minikube Deployment..."

# Step 1: Check if Minikube is running
echo "📋 Checking Minikube status..."
if ! minikube status > /dev/null 2>&1; then
    echo "❌ Minikube is not running. Starting Minikube..."
    minikube start --memory=4096 --cpus=2
else
    echo "✅ Minikube is already running"
fi

# Step 2: Enable Ingress addon
echo "🔌 Enabling Ingress addon..."
minikube addons enable ingress

# Step 3: Set namespace context
echo "🎯 Setting kubectl namespace..."
kubectl config set-context --current --namespace=$NAMESPACE 2>/dev/null || true

# Step 4: Create namespace
echo "📦 Creating namespace..."
kubectl apply -f namespace.yaml

# Step 5: Apply ConfigMap
echo "⚙️  Applying ConfigMap..."
kubectl apply -f configmap.yaml

# Step 6: Apply Deployment
echo "🚀 Applying Deployment..."
kubectl apply -f deployment.yaml

# Step 7: Apply Service
echo "🔗 Applying Service..."
kubectl apply -f service.yaml

# Step 8: Apply Ingress
echo "🌐 Applying Ingress..."
kubectl apply -f ingress.yaml

# Step 9: Apply HPA
echo "📈 Applying HorizontalPodAutoscaler..."
kubectl apply -f hpa.yaml

# Step 10: Wait for deployment
echo "⏳ Waiting for deployment to be ready..."
kubectl rollout status deployment/aura-app -n $NAMESPACE

# Step 11: Get service URL
echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📍 Access AuraForecasting at:"
echo "   - Via NodePort: http://$(minikube ip):30080"
echo "   - Via Ingress:  http://aura.local (add to hosts: $(minikube ip) aura.local)"
echo "   - Via Minikube: $(minikube service aura-service -n $NAMESPACE --url)"
echo ""
echo "📊 Useful commands:"
echo "   - kubectl get pods -n $NAMESPACE"
echo "   - kubectl get svc -n $NAMESPACE"
echo "   - kubectl logs -l app=aura -n $NAMESPACE"
echo "   - kubectl describe deployment aura-app -n $NAMESPACE"
echo "   - minikube dashboard"
