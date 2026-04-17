# AuraForecasting: The Future of Business Intelligence

**Predictive Intelligence Suite for High-Value Assets and Enterprise Growth.**

---

## 🌟 Vision
> "Our vision is to democratize advanced data intelligence for every business owner. Aura is the heartbeat of future-ready business."
> — **Muhammad Burhan Shahzad**, Founder & CEO

---

## 📸 Product Preview
*(Add your screenshots to the `/images` folder and update the paths below)*
![Dashboard](images/dashboard.png)

---

## 🏗️ Project Journey & Roadmap
This project represents a comprehensive MLOps lifecycle, transforming a local AI prototype into a professional, containerized product.

### ✅ Completed Phases
1.  **Phase 1: Architecture Design**
    - Designed a micro-services architecture to isolate AI logic from business operations.
2.  **Phase 2: Core Development**
    - Built a robust **Flask API** (Backend), an optimized **Meta Prophet** engine (ML Service), and a premium **React Dashboard** (Frontend).
    - Implemented a "Data Lab" with auto-industry detection and CSV processing.
3.  **Phase 3: Containerization**
    - Developed a "Super-Dockerfile" monolith approach for one-click deployment.
    - Optimized the stack with Nginx, Gunicorn, and Supervisord.
    - Pushed production-ready images to **Docker Hub**.
4.  **Phase 4: Kubernetes Deployment**
    - Successfully scaled the product using Minikube/Kubernetes.
    - Implemented microservices orchestration and service discovery.

### ✅ Completed Phases (Continued)
5.  **Phase 5: Monitoring Setup**
    - Deployed Prometheus for metrics collection and alerting
    - Deployed Grafana with pre-configured AuraForecasting dashboards
    - Implemented alerting rules for pod health, CPU/memory usage, and restarts
    - Full monitoring stack isolated in `monitoring/` namespace
6.  **Phase 6: Testing & Demo**
    - Implementing end-to-end integration testing and user documentation.

---

## 🚀 Get Started in 60 Seconds
AuraForecasting is fully containerized. No manual dependencies required.

### Run the Application

```bash
docker run -p 80:80 burhan107/aura-pro:latest
```
Access the dashboard at: **[http://localhost](http://localhost)**

### Deploy with Monitoring (Kubernetes)

```bash
# Deploy AuraForecasting to Kubernetes
cd k8s && ./deploy.sh

# Deploy Monitoring Stack (Prometheus + Grafana)
cd ../monitoring && ./deploy-monitoring.sh
```

Access monitoring services:
- **Prometheus**: `http://<minikube-ip>:30090`
- **Grafana**: `http://<minikube-ip>:30030` (admin/admin123)

---

## 🛠️ Technology Stack
- **Frontend:** React, Tailwind CSS, Recharts
- **Backend:** Python, Flask, Gunicorn
- **AI/ML:** Meta Prophet, Pandas, NumPy
- **Infrastructure:** Docker, Nginx, Supervisord, Kubernetes
- **Monitoring:** Prometheus, Grafana
- **Database:** SQLite (Embedded for portability)

---

## 👤 Author
**Muhammad Burhan Shahzad**  
Founder & CEO, AuraForecasting Intelligence

---
*© 2026 AuraForecasting. All rights reserved.*
