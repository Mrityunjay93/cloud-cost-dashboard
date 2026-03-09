# Codex Project Context: Cloud Cost Monitor

This file gives AI assistants a fast, reliable summary of what is already set up and what must stay consistent.

## 1. Repository Shape

Monorepo root: `d:/Projects/CloudCostMonitor`

Key directories:

- `backend/`: Node.js + Express API
- `frontend/`: React app (Create React App)
- `docker/`: Dockerfiles (local/container workflows)

## 2. Backend Deployment (AWS Elastic Beanstalk)

Current backend is deployed via Elastic Beanstalk (not ECS for this active path).

Environment:

- App: `cloud-cost-monitor`
- Environment: `cloud-cost-monitor-env`
- Region: `ap-south-1`
- Runtime: Node.js 20 (Amazon Linux 2023)
- Base API URL: `https://cloud-cost-monitor-env.eba-uepuh5dy.ap-south-1.elasticbeanstalk.com/api`

Important backend env vars (set in EB):

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`
- `CORS_ORIGIN`
- Any auth/JWT env vars used by backend

Notes:

- Earlier deploy issues were caused by EB not finding backend entry files.
- Backend root must contain expected runtime files (for example `package.json`, server entrypoint).

## 3. Frontend Deployment (AWS Amplify)

Current frontend is deployed via Amplify from GitHub.

Amplify setup:

- App: `cloud-cost-dashboard`
- Repo: `Mrityunjay93/cloud-cost-dashboard`
- Branch: `main`
- Monorepo app root: `frontend`
- Build command: `npm run build`
- Output directory: `build`
- Live URL: `https://main.d383x4jm1nc4x.amplifyapp.com/`

## 4. Frontend-to-Backend API Contract

Frontend must use environment-driven API base URL:

- `REACT_APP_API_URL=https://cloud-cost-monitor-env.eba-uepuh5dy.ap-south-1.elasticbeanstalk.com/api`

Code reference:

- `frontend/src/services/api.js` uses:
  - `baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api"`

Rule:

- Do not hardcode production API URLs in component-level calls.
- Use shared API client/base URL pattern.

## 5. CORS Expectations

Backend CORS is controlled by `CORS_ORIGIN` in backend env.

Current backend behavior in `backend/app.js`:

- Parses comma-separated `CORS_ORIGIN`
- Allows requests when:
  - origin is missing (non-browser/health checks), or
  - `*` is configured, or
  - request origin is in allowed list

Production recommendation:

- Set `CORS_ORIGIN=https://main.d383x4jm1nc4x.amplifyapp.com`
- Add custom domain(s) as comma-separated values when introduced

## 6. Problems Already Solved

- EB startup/health issues due to backend detection/root layout
- Cross-domain frontend/backend connectivity (Amplify -> EB)
- Monorepo Amplify config (correct frontend root path)

## 7. Current Known-Good State

- Backend endpoint responds from EB domain
- Frontend is live on Amplify
- Frontend API client is environment-based (`REACT_APP_API_URL`)
- Backend CORS logic supports explicit allowlist via `CORS_ORIGIN`

## 8. Verification Checklist (After Any Deployment Change)

1. Backend health: `GET /api/health` returns OK.
2. Frontend build contains correct API env value.
3. Browser login/signup succeeds from Amplify URL.
4. Project/resource CRUD flows succeed end-to-end.
5. No CORS failures in browser console/network tab.

## 9. Important Context for Future Assistants

- `DEPLOY_AWS.md` documents an alternate ECS/S3/CloudFront pipeline.
- Active production path right now is Elastic Beanstalk + Amplify.
- If deployment strategy changes, update this file first to avoid stale guidance.
