# GitHub and Vercel deployment

## GitHub

The repository is initialised on the `main` branch. To publish it, create an
empty GitHub repository and connect this checkout:

```bash
git remote add origin git@github.com:YOUR_ACCOUNT/lumennous.git
git push -u origin main
```

The GitHub Actions workflow runs linting, all unit tests, and a production
build for pull requests and pushes to `main`.

## Vercel

1. Import the GitHub repository in Vercel.
2. Keep the detected framework as Next.js. The repository root is the app root.
3. Add `DEEPSEEK_API_KEY` as a server-side secret only if the optional route is
   required.
4. Set `DEEPSEEK_AI_ENABLED=true` only after the product flow, consent copy,
   rate limiting, and cost controls have been approved.
5. Keep `DEEPSEEK_BASE_URL=https://api.deepseek.com` and
   `DEEPSEEK_MODEL=deepseek-v4-pro`, or rely on their code defaults.

Vercel's Git integration creates preview deployments for branches and pull
requests and deploys `main` to production. `vercel.json` pins the install and
build commands; no Vercel CLI or deployment token is required in GitHub.

The local prayer and meditation Engine does not depend on DeepSeek and remains
available when the optional external service is disabled.
