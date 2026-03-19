# 365 Evergreen LMS — Azure SWA scaffold

This folder is a starter scaffold to migrate the current Power App into an Azure Static Web App backed by Azure Functions for Dataverse/Graph integration.

Quick start (local):

1. Install node and npm.
2. cd azure-swa
3. npm install
4. npm run dev

Deploy:

- Create an Azure Static Web App in the portal and connect a GitHub repo, or generate a deployment token and add it to your repository secrets as `AZURE_STATIC_WEB_APPS_API_TOKEN`.
- Push this folder to a repository `main` branch. The provided GitHub Action at `.github/workflows/deploy-swa.yml` will build and deploy.

Auth and Dataverse notes

- Use Azure AD App Registration and either:
  - Use Managed Identity for the Azure Functions (recommended) and create an Application User in Dataverse mapped to the app registration; or
  - Use the On-Behalf-Of flow to let the frontend sign-in with MSAL and the functions exchange tokens.

- Implement the Dataverse logic in `functions/api/dataverse-proxy/index.js`.

If you want, I can:
- Commit this scaffold into a new git repo in the workspace and create helpful scripts to push to a remote you provide, or
- Prepare the exact Azure CLI commands to create SWA, Function App, App Registration, and Dataverse App User.
