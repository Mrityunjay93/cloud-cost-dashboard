# AWS Deployment Guide

This project is set up for:
- Backend: ECS Fargate + ECR
- Frontend: S3 + CloudFront
- Database: RDS PostgreSQL
- CI/CD: GitHub Actions (OIDC)

## 1) Prerequisites

- AWS account
- Domain (optional but recommended)
- GitHub repository connected to this code
- AWS CLI installed locally

## 2) Build and run locally with Docker

```bash
docker compose up --build
```

App URLs:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000/api/health`

## 3) Create AWS resources

1. Create ECR repo for backend image (example name: `cloud-cost-monitor-backend`)
2. Create RDS PostgreSQL instance and DB schema/tables
3. Create ECS cluster and ECS service (Fargate) with ALB target group for backend container port `5000`
4. Create S3 bucket for frontend static hosting
5. Create CloudFront distribution with S3 bucket as origin
6. Create CloudWatch log group for ECS (example: `/ecs/cloud-cost-monitor`)

## 4) GitHub OIDC role

Create an IAM role for GitHub Actions with trust policy for:
- `token.actions.githubusercontent.com`
- Your repo (`repo:<org>/<repo>:ref:refs/heads/main`)

Attach permissions for:
- ECR push/pull
- ECS update service/register task definition
- S3 sync
- CloudFront invalidation
- CloudWatch logs

Add role ARN as GitHub secret:
- `AWS_DEPLOY_ROLE_ARN`

## 5) GitHub repository secrets

Set these repository secrets:

Common:
- `AWS_REGION`
- `AWS_DEPLOY_ROLE_ARN`

Backend deploy:
- `ECR_REPOSITORY`
- `ECS_CLUSTER`
- `ECS_SERVICE`
- `ECS_TASK_FAMILY`
- `ECS_EXECUTION_ROLE_ARN`
- `ECS_TASK_ROLE_ARN`
- `ECS_LOG_GROUP`
- `CORS_ORIGIN` (your frontend CloudFront URL or custom domain)
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SSL` (`true` for RDS)
- `JWT_SECRET`

Frontend deploy:
- `FRONTEND_S3_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `FRONTEND_API_URL` (example: `https://api.example.com/api`)

## 6) Deploy flows

- Backend workflow: `.github/workflows/backend-deploy.yml`
- Frontend workflow: `.github/workflows/frontend-deploy.yml`

Trigger:
- Push to `main`, or
- Manual run via GitHub Actions UI (`workflow_dispatch`)

## 7) DNS and TLS (recommended)

- Backend API: Route53 record to ALB + ACM certificate
- Frontend: Route53 record to CloudFront + ACM certificate

Then set:
- `FRONTEND_API_URL=https://api.yourdomain.com/api`
- `CORS_ORIGIN=https://app.yourdomain.com`

## 8) Production checks

- `GET /api/health` returns `{"status":"ok"}`
- Frontend can register/login
- Project creation and resource addition work
- CloudWatch logs show no DB auth/CORS/JWT errors
