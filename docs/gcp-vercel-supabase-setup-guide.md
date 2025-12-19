# How to deploy Adaptive Habits on Supabase + Google Cloud Run + Vercel
This setup is free to setup (...or atleast very budget friendly)


## Prerequisites:
- Google Cloud CLI
<!-- - Vercel CLI -->

---

1. Create Supabase project..., then:
- Copy the supabase transaction pooler url
- Insert your database password into the copied URL
- Keep this URL (including the password)

2. Create google cloud project..., then:
- Make sure billing is setup in Google Cloud Console
```bash
cd services/habits-service
gcloud auth login
gcloud projects list
gcloud config set project [Your project ID]
gcloud services enable containerregistry.googleapis.com
gcloud builds submit --tag gcr.io/[Your project ID]/habits-backend
```

3. Inside Google Cloud Console:
- (go to Cloud Run...) Create service
- Select container image
- Select "Allow unauthenticated invocations"
- Add environment variables:
    - DATABASE_URL (supabase transaction pooler url, with password)
    - ALLOWED_ORIGINS (test: *)
    - SECRET_KEY (random long secret string)
    - ENV_MODE = "production"
- Click "Create"
- Copy the URL (example: https://*.europe-north2.run.app)

4. Create Vercel project..., then:
- Set root directory to clients/adaptive-habits-web-app
- Add environment variables:
    - NODE_ENV = "production"
    - NEXT_PUBLIC_API_URL = Cloud Run Service URL + /api/v1 (example: https://*.europe-north2.run.app/api/v1)
- Click "Deploy"
- Copy Vercel URL (example: adaptive-habits.vercel.app)

5. Go back to Cloud Run
- Update ALLOWED_ORIGINS (your Vercel URL)
- Redeploy Cloud Run service

6. Done!
