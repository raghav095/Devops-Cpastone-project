# TaskBoard — DevOps Final Capstone Project

[![CI/CD Pipeline](https://github.com/raghav095/Devops-Cpastone-project/actions/workflows/devsecops-ci-cd.yml/badge.svg)](https://github.com/raghav095/Devops-Cpastone-project/actions/workflows/devsecops-ci-cd.yml)

**Author:** Raghav Rathi (Roll No: 10033) — DevOps Final Capstone Project  
**Repository:** [https://github.com/raghav095/Devops-Cpastone-project](https://github.com/raghav095/Devops-Cpastone-project)  

TaskBoard is a SaaS-style project management web application built to demonstrate a complete, production-grade DevOps lifecycle—from local development to automated CI/CD, container security, declarative cloud infrastructure, Kubernetes deployment, and real-time observability.

---

## ⚡ Quickstart & Setup Guide (Run on Any Machine)

This repository is designed to run consistently on macOS, Linux, or Windows (WSL2).

### Prerequisites
- [Docker Desktop](https://www.docker.com/) / Docker Engine & Docker Compose
- [kubectl](https://kubernetes.io/docs/tasks/tools/) & [Helm 3+](https://helm.sh/)
- [Python 3.12+](https://www.python.org/) (optional, for running tests natively)

---

### 1. Run Full Stack via Docker Compose (Fastest — 1 Command)
Starts PostgreSQL 16, FastAPI Backend, and React Frontend in isolated containers:

```bash
# Clone the repository
git clone https://github.com/raghav095/Devops-Cpastone-project.git
cd Devops-Cpastone-project

# Launch full stack
docker compose up --build -d

# Verify container status
docker compose ps
```

- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Liveness & Readiness**: [http://localhost:8000/health](http://localhost:8000/health) & [http://localhost:8000/ready](http://localhost:8000/ready)
- **Prometheus Metrics**: [http://localhost:8000/metrics](http://localhost:8000/metrics)

To stop the stack:
```bash
docker compose down
```

---

### 2. Run Automated Pytest Suite
Tests run against an isolated SQLite test database with zero side-effects on production data:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
pytest -v
```

---

### 3. Deploy to Kubernetes with Helm
Deploy to any local or cloud Kubernetes cluster (Kind, Minikube, EKS, GKE, AKS):

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Deploy or upgrade Helm release
helm upgrade --install taskboard ./helm/taskboard \
  --namespace taskboard \
  --create-namespace

# 3. Verify deployed resources
kubectl get pods,svc,ingress,hpa -n taskboard
helm list -n taskboard
```

---

### 4. Validate Terraform AWS Infrastructure
AWS VPC and EKS infrastructure defined in declarative HCL:

```bash
cd terraform
terraform init
terraform validate
terraform plan
```

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
├── screenshots/             # Architecture, execution, and verification evidence
├── .github/workflows/       # Automated DevSecOps CI/CD workflow
└── README.md                # Complete project documentation
```

---

## Comprehensive Architecture & Implementation Guide

### Full Stack Application Runtime (Frontend, Backend & PostgreSQL)
- **FastAPI Backend**: Runs on port `8000`, exposes `/health`, `/ready`, `/metrics`, and `/api/tasks`.
- **Database**: PostgreSQL with Alembic migrations (`backend/alembic/versions/`).
- **React Frontend**: Runs on port `3000`, rendering task management UI.

**Commands to run**:
```bash
docker compose up --build -d
docker compose ps
```

**Live Verification & Deployment Proofs**:
- **Full Stack Container Runtime**:
  ![Full Stack Docker Compose Deployment](./screenshots/m1-01-docker-compose-ps.png)
- **TaskBoard Dashboard UI (Frontend)**:
  ![TaskBoard Frontend Dashboard](./screenshots/m1-02-frontend-dashboard.png)
- **FastAPI Interactive Swagger Documentation (Backend)**:
  ![FastAPI Swagger API Documentation](./screenshots/m1-03-swagger-api.png)

---

### Automated Testing Suite & Test Isolation
- **Unit Tests**: 6 comprehensive test cases covering health checks (`/health`, `/ready`), root info (`/`), task creation & retrieval (`POST /api/tasks`, `GET /api/tasks/{id}`), task listing (`GET /api/tasks`), and metrics statistics (`GET /api/tasks/stats`).
- **Test Database**: Isolated SQLite test database ensuring zero pollution of production PostgreSQL.

**Commands to run**:
```bash
cd backend
pytest -v
```

**Live Verification & Test Execution**:
- **Pytest Execution Results (All 6 Tests Passing)**:
  ![Pytest Execution Results](./screenshots/m2-01-pytest-tests.png)

---

### Version Control & Git Commit History
- **Version Control**: Git commit history tracking application and infrastructure progression with Conventional Commits.

**Commands to run**:
```bash
git log --oneline -n 12
git status -s
```

**Live Verification & Commit History**:
- **Git Commit History (Structured & Meaningful Commits)**:
  ![Git Commit History](./screenshots/m3-01-git-history.png)

---

### Containerization & Multi-Stage Builds
- **Backend Image**: Minimal Python runtime container running securely as non-root user `appuser`.
- **Frontend Image**: Multi-stage build (Node 20 build stage -> Nginx alpine runtime stage).

**Commands to run**:
```bash
docker build -t taskboard-backend:local backend/
docker build -t taskboard-frontend:local frontend/
docker images | grep taskboard
```

**Live Verification & Image Builds**:
- **Backend Non-Root Docker Image Build**:
  ![Backend Docker Build](./screenshots/m4-01-docker-backend-build.png)
- **Frontend Multi-Stage Docker Image Build & Images List**:
  ![Frontend Multi-Stage Docker Build & Images List](./screenshots/m4-02-docker-frontend-images.png)

---

### Automated CI/CD Pipeline (GitHub Actions)
- **Workflow**: Automated pipeline in `.github/workflows/devsecops-ci-cd.yml` executing tests, building images, and pushing to GitHub Container Registry (GHCR) using Git SHA tags.

**Steps to run**:
1. Push code to GitHub (`git push origin main`).
2. Navigate to your GitHub Repository → **Actions** tab.
3. Open GitHub Profile → **Packages** tab.

**Live Verification & Pipeline Execution**:
- **GitHub Actions CI/CD Pipeline Execution (All Jobs Green)**:
  ![GitHub Actions CI/CD Pipeline Execution](./screenshots/m5-01-github-actions-pipeline.png)
- **GitHub Actions Workflow Runs Dashboard**:
  ![GitHub Actions Workflow Runs Dashboard](./screenshots/m5-02-actions-workflow-runs.png)

---

### DevSecOps Container Vulnerability Scanning (Trivy)
- **Security Gate**: Container vulnerability scanning using Aqua Security Trivy failing on `CRITICAL,HIGH` CVEs.

**Commands to run**:
```bash
trivy image taskboard-backend:local
```

**Live Verification & Security Gate**:
- **Trivy Vulnerability Scan Output**:
  ![Aqua Security Trivy Security Scan](./screenshots/m6-01-trivy-scan.png)

> **Security Gate Analysis & CVE Assessment**:  
> Aqua Security Trivy scanned both the `taskboard-backend` and `taskboard-frontend` container images, evaluating base OS packages and Python/Node dependencies against the National Vulnerability Database (NVD). The scan verified that no unpatched `CRITICAL` or `HIGH` vulnerabilities exist in the runtime environment. By failing the pipeline on severe CVEs, this automated security gate guarantees that only hardened, compliant artifacts are pushed to the GitHub Container Registry (GHCR).

---

### Infrastructure as Code (AWS VPC & EKS with Terraform)
- **Infrastructure as Code**: Declarative AWS VPC (public/private subnets across multiple AZs) and AWS EKS cluster with managed worker node groups in `terraform/`.

**Commands to run**:
```bash
cd terraform
terraform init
terraform plan
```

**Live Verification & Infrastructure Provisioning**:
- **Terraform AWS Plan Execution**:
  ![Terraform Plan Execution](./screenshots/m7-01-terraform-plan.png)
- **Terraform Plan Caller Identity & AWS Account Verification**:
  ![Terraform AWS Identity Verification](./screenshots/m7-01-terraform-plan-identity.png)
- **Terraform Configuration Validation**:
  ![Terraform Configuration Validation](./screenshots/m7-01-terraform-validate.png)
- **Terraform Apply Execution Initiation**:
  ![Terraform Apply Initialization](./screenshots/m7-03-terraform-apply-start.png)
- **Terraform EKS Managed Node Group Provisioning**:
  ![Terraform EKS Node Group Provisioning](./screenshots/m7-04-terraform-apply-progress.png)
- **AWS Management Console - Active EKS Cluster**:
  ![AWS Management Console - EKS Active Cluster](./screenshots/m7-05-aws-eks-cluster.png)
- **AWS Management Console - Provisioned VPC**:
  ![AWS Management Console - Provisioned VPC](./screenshots/m7-06-aws-vpc.png)
- **Clean Resource Teardown Verification (52 Resources Destroyed, Zero Runaway Costs)**:
  ![Clean Resource Teardown (52 Resources Destroyed)](./screenshots/m7-07-terraform-destroy.png)

> **Note on Infrastructure**: Terraform configuration in `terraform/` defines a production-ready AWS VPC (4 subnets across 2 AZs, NAT gateway) and AWS EKS cluster (`1.31`) with managed worker node groups. Configuration is validated, formatted, and verified via `terraform validate`. All resources were cleanly destroyed after validation to prevent cloud costs.

---

### Kubernetes Deployment & Helm Package Management
- **Helm Chart**: Parameterized deployment in `helm/taskboard/` managing backend, frontend, PostgreSQL, ClusterIP services, Ingress, and HorizontalPodAutoscaler (HPA).

**Commands to run**:
```bash
helm lint helm/taskboard
helm template taskboard helm/taskboard
helm upgrade --install taskboard ./helm/taskboard -n taskboard
kubectl get pods,svc,ingress,hpa -n taskboard
helm list -n taskboard
```

**Live Verification & Cluster Status**:
- **Helm Package Linting & Manifest Templates**:
  ![Helm Lint & Manifest Templates](./screenshots/m8-01-helm-lint-and-template.png)
- **Kubernetes Live Running Pods, Services, Ingress & HPA**:
  ![Kubernetes Pods, Services, Ingress & HPA Status](./screenshots/m8-02-k8s-running-pods.png)

---

### Observability, Metrics & Prometheus Instrumentation
- **Metrics**: FastAPI instrumentation exporting `/metrics` endpoint scraped by Prometheus and rendered in Grafana.

**Commands to run**:
```bash
curl http://localhost:8000/metrics
kubectl get servicemonitors -n taskboard
```

**Live Verification & Instrumentation**:
- **Prometheus Metrics & Live Application Instrumentation**:
  ![Prometheus Live Metrics Scrape](./screenshots/m9-01-metrics.png)

---

### Incident Response, Troubleshooting & Root Cause Analysis
- **Scenarios**: Hands-on incident response for broken container images and mismatched Kubernetes service selectors in `troubleshooting/`.

**Commands to run**:
```bash
kubectl apply -f troubleshooting/broken-image.yaml
kubectl describe pod -n taskboard
kubectl apply -f troubleshooting/broken-service.yaml
kubectl get endpoints -n taskboard
```

**Live Verification & Root Cause Analysis**:
- **Troubleshooting RCA Output (ImagePullBackOff & Mismatched Service Selector)**:
  ![Troubleshooting RCA Output (ImagePullBackOff & Service Resolution)](./screenshots/m10-01-troubleshooting.png)
