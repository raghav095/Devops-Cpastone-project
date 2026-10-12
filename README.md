# Capstone Project: TaskBoard SaaS Management Application

## Overview
TaskBoard is a production-grade SaaS-style project management application built to demonstrate an end-to-end DevOps lifecycle from local development to cloud-native Kubernetes deployment and observability.

---

## Architecture Diagram

```text
Developer Laptop ──► Git / GitHub
                        │
                        ▼
             GitHub Actions CI/CD Pipeline
               ├── pytest unit testing
               ├── frontend build
               ├── Docker multi-stage image build
               ├── Trivy container security scan
               └── GHCR image push with SHA tags
                        │
                        ▼
            Terraform Infrastructure as Code (AWS VPC + EKS)
                        │
                        ▼
             Kubernetes & Helm Package Management
                        │
       ┌────────────────┴────────────────┐
       ▼                                 ▼
Frontend (React)                Backend (FastAPI)
       │                                 │
       └────────────────► PostgreSQL ────┘
                         │
              Prometheus & Grafana Observability
```

---

## Directory Structure

```text
capstone-project/
├── backend/                 # FastAPI REST API, SQLAlchemy models, Alembic migrations, Pytest
├── frontend/                # React + Vite UI dashboard (multi-stage Nginx Dockerfile)
├── docker-compose.yml       # Local stack containerization (PostgreSQL + Backend + Frontend)
├── terraform/               # AWS VPC & EKS Infrastructure as Code
├── helm/taskboard/          # Helm package templates, values, and ingress rules
├── k8s/                     # Namespace & bootstrap manifests
├── monitoring/              # Prometheus ServiceMonitor & Grafana dashboard values
├── security/                # DevSecOps security policies & Trivy configs
├── gitops/                  # ArgoCD Application reconciliation manifest
├── troubleshooting/         # Incident response & RCA lab scenarios
├── .github/workflows/       # Automated DevSecOps CI/CD workflow
├── screenshots/             # Output screenshot directory for submission
└── README.md                # Complete project documentation
```

---

## Module-by-Module Setup & Real Screenshot Guide

### Module 1: Application Stack (Frontend + Backend + Database)
- **FastAPI Backend**: Runs on port `8000`, exposes `/health`, `/ready`, `/metrics`, and `/api/tasks`.
- **Database**: PostgreSQL with Alembic migrations (`backend/alembic/versions/`).
- **React Frontend**: Runs on port `3000`, rendering task management UI.

**Commands to run**:
```bash
cd capstone-project
docker compose up --build -d
docker compose ps
```

**Screenshots for Submission**:
- **Docker Compose Stack Running**:
  ![Docker Compose Stack](./screenshots/m1-01-docker-compose-ps.png)
- **TaskBoard Dashboard (Frontend on port 3000)**:
  ![TaskBoard Frontend Dashboard](./screenshots/m1-02-frontend-dashboard.png)
- **FastAPI Interactive API Docs (Backend on port 8000)**:
  ![FastAPI Swagger Docs](./screenshots/m1-03-swagger-api.png)

---

### Module 2: Automated Pytest Suite
- **Unit Tests**: 6 comprehensive test cases covering health checks (`/health`, `/ready`), root info (`/`), task creation & retrieval (`POST /api/tasks`, `GET /api/tasks/{id}`), task listing (`GET /api/tasks`), and metrics statistics (`GET /api/tasks/stats`).
- **Test Database**: Isolated SQLite test database ensuring zero pollution of production PostgreSQL.

**Commands to run**:
```bash
cd capstone-project/backend
docker run --rm -v $(pwd):/app -w /app session21-python-backend:latest pytest -v
```

**Screenshots for Submission**:
- **Pytest Execution (All 6 Tests Passing)**:
  ![Pytest Execution Results](./screenshots/m2-01-pytest-tests.png)

---

### Module 3: Git & Version Control
- **Version Control**: Git commit history tracking application and infrastructure progression.

**Commands to run**:
```bash
git log --oneline -n 12
git status -s
```

**Screenshots for Submission**:
- **Git Commit History (10+ Meaningful Commits)**:
  ![Git Commit History](./screenshots/m3-01-git-history.png)

---

### Module 4: Docker Containerization
- **Backend Image**: Non-root Python runtime container.
- **Frontend Image**: Multi-stage build (Node 20 build stage -> Nginx alpine runtime stage).

**Commands to run**:
```bash
docker build -t taskboard-backend:local capstone-project/backend/
docker build -t taskboard-frontend:local capstone-project/frontend/
docker images | grep taskboard
```

**Screenshots for Submission**:
- **Backend Non-Root Docker Image Build**:
  ![Backend Docker Build](./screenshots/m4-01-docker-backend-build.png)
- **Frontend Multi-Stage Docker Image Build & Images List**:
  ![Frontend Docker Build & Images](./screenshots/m4-02-docker-frontend-images.png)

---

### Module 5: CI/CD Pipeline (GitHub Actions)
- **Workflow**: Automated pipeline in `.github/workflows/devsecops-ci-cd.yml` executing tests, building images, and pushing to GitHub Container Registry (GHCR) using Git SHA tags.

**Steps to run**:
1. Push code to GitHub (`git push origin main`).
2. Navigate to your GitHub Repository → **Actions** tab.
3. Open GitHub Profile → **Packages** tab.

**Screenshots for Submission**:
- **GitHub Actions CI/CD Pipeline Execution (All 3 Jobs Green)**:
  ![Module 5 CI/CD Pipeline](./screenshots/m5-01-github-actions-pipeline.png)
- **GitHub Actions Workflow Runs Dashboard**:
  ![Module 5 Workflow Runs Dashboard](./screenshots/m5-02-actions-workflow-runs.png)

---

### Module 6: DevSecOps & Trivy Container Scan
- **Security Gate**: Container vulnerability scanning using Aqua Security Trivy failing on `CRITICAL,HIGH` CVEs.

**Commands to run**:
```bash
trivy image taskboard-backend:local
```

**Screenshots for Submission**:
- **Trivy Vulnerability Scan Output**:
  ![Module 6 Trivy Security Scan](./screenshots/m6-01-trivy-scan.png)

---

### Module 7: Terraform Infrastructure (AWS VPC + EKS)
- **Infrastructure as Code**: Declarative AWS VPC (public/private subnets) and EKS cluster module in `terraform/`.

**Commands to run**:
```bash
cd capstone-project/terraform
terraform init
terraform plan
```

**Screenshots for Submission**:
- **Terraform Configuration Validation (HCL Validated)**:
  ![Module 7 Terraform Validate](./screenshots/m7-01-terraform-validate.png)

> **Note on Infrastructure**: Terraform configuration in `terraform/` defines a production-ready AWS VPC (4 subnets across 2 AZs, NAT gateway) and AWS EKS cluster (`1.31`) with managed worker node groups. Configuration is validated, formatted, and verified via `terraform validate`.

---

### Module 8: Kubernetes & Helm Package Management
- **Helm Chart**: Parameterized deployment in `helm/taskboard/` managing backend, frontend, PostgreSQL, ClusterIP services, Ingress, and HorizontalPodAutoscaler (HPA).

**Commands to run**:
```bash
helm lint helm/taskboard
helm template taskboard helm/taskboard
helm upgrade --install taskboard ./helm/taskboard -n taskboard
kubectl get pods,svc,ingress,hpa -n taskboard
helm list -n taskboard
```

**Screenshots for Submission**:
- **Helm Package Linting & Manifest Templates**:
  ![Module 8 Helm Lint and Templates](./screenshots/m8-01-helm-lint-and-template.png)
- **Kubernetes Live Running Pods, Services, Ingress & HPA**:
  ![Module 8 K8s Running Pods & Helm Status](./screenshots/m8-02-k8s-running-pods.png)

---

### Module 9: Observability & Prometheus/Grafana
- **Metrics**: FastAPI instrumentation exporting `/metrics` endpoint scraped by Prometheus and rendered in Grafana.

**Commands to run**:
```bash
curl http://localhost:8000/metrics
kubectl get servicemonitors -n taskboard
```

**Screenshots for Submission**:
- **Prometheus Metrics & Grafana Dashboard Output**:
  ![Module 9 Observability](./screenshots/09-observability.png)

---

### Module 10: Troubleshooting Lab & Root Cause Analysis
- **Scenarios**: Incident response for broken image tags and mismatched service labels in `troubleshooting/`.

**Commands to run**:
```bash
kubectl apply -f capstone-project/troubleshooting/broken-image.yaml
kubectl describe pod -n taskboard
kubectl apply -f capstone-project/troubleshooting/broken-service.yaml
kubectl get endpoints -n taskboard
```

**Screenshots for Submission**:
- **Troubleshooting RCA Output**:
  ![Module 10 Troubleshooting RCA](./screenshots/10-troubleshooting.png)
