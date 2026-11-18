#!/usr/bin/env bash
# One-time setup that lets GitHub Actions deploy this site to Cloud Run.
#
# Run it in Google Cloud Shell (https://shell.cloud.google.com), which already has
# gcloud installed and logged in as you:
#
#   curl -fsSL https://raw.githubusercontent.com/hamzafoundry/foundrystack-website/redesign/scripts/setup-github-deploy.sh -o setup.sh
#   bash setup.sh
#
# (If the repository is private, upload this file to Cloud Shell instead: "⋮ > Upload".)
#
# It uses Workload Identity Federation: GitHub proves who it is to Google with a
# short-lived token, so no service-account key is ever created or stored in GitHub.
# Only pushes to the main branch of this repository can deploy.
# Safe to run more than once.

set -euo pipefail

PROJECT_ID="${PROJECT_ID:-gen-lang-client-0762399417}"
REPO="${REPO:-hamzafoundry/foundrystack-website}"
SA_NAME="github-deployer"
POOL_ID="github"
PROVIDER_ID="foundrystack-website"

echo "==> Project: $PROJECT_ID"
gcloud config set project "$PROJECT_ID" >/dev/null

echo
echo "==> Cloud Run services in this project:"
gcloud run services list --format="table(metadata.name:label=SERVICE, region:label=REGION, status.url:label=URL)"
echo
read -rp "Name of the service that serves foundrystack.net: " SERVICE
read -rp "Region of that service (e.g. us-central1): " REGION

gcloud run services describe "$SERVICE" --region "$REGION" >/dev/null \
  || { echo "Service $SERVICE not found in $REGION"; exit 1; }

echo
echo "==> Enabling the APIs a source deploy needs"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com \
  iamcredentials.googleapis.com sts.googleapis.com

PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
DEPLOY_SA="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
COMPUTE_SA="$PROJECT_NUMBER-compute@developer.gserviceaccount.com"
RUNTIME_SA="$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(spec.template.spec.serviceAccountName)')"
RUNTIME_SA="${RUNTIME_SA:-$COMPUTE_SA}"

echo
echo "==> Deploy service account: $DEPLOY_SA"
gcloud iam service-accounts describe "$DEPLOY_SA" >/dev/null 2>&1 \
  || gcloud iam service-accounts create "$SA_NAME" --display-name="GitHub Actions deployer (foundrystack-website)"

# Deploy from source: upload code, run Cloud Build, roll out a Cloud Run revision.
for role in roles/run.sourceDeveloper roles/serviceusage.serviceUsageConsumer; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$DEPLOY_SA" --role="$role" --condition=None >/dev/null
done

# It must be allowed to "act as" the service's runtime account and the account Cloud Build uses.
for sa in $(printf '%s\n' "$RUNTIME_SA" "$COMPUTE_SA" | sort -u); do
  gcloud iam service-accounts add-iam-policy-binding "$sa" \
    --member="serviceAccount:$DEPLOY_SA" --role=roles/iam.serviceAccountUser >/dev/null
done

echo
echo "==> Workload Identity Federation (GitHub -> Google, no keys)"
gcloud iam workload-identity-pools describe "$POOL_ID" --location=global >/dev/null 2>&1 \
  || gcloud iam workload-identity-pools create "$POOL_ID" --location=global --display-name="GitHub Actions"

gcloud iam workload-identity-pools providers describe "$PROVIDER_ID" \
  --location=global --workload-identity-pool="$POOL_ID" >/dev/null 2>&1 \
  || gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_ID" \
    --location=global --workload-identity-pool="$POOL_ID" \
    --display-name="foundrystack-website" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
    --attribute-condition="assertion.repository == '$REPO' && assertion.ref == 'refs/heads/main'"

gcloud iam service-accounts add-iam-policy-binding "$DEPLOY_SA" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_ID/attribute.repository/$REPO" >/dev/null

PROVIDER_NAME="projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_ID/providers/$PROVIDER_ID"

cat <<EOF

==> Done. Add these five values in GitHub:
    $REPO -> Settings -> Secrets and variables -> Actions -> Variables tab -> New repository variable
    (They are identifiers, not passwords, so they go under Variables, not Secrets.)

    GCP_PROJECT_ID              $PROJECT_ID
    CLOUD_RUN_SERVICE           $SERVICE
    CLOUD_RUN_REGION            $REGION
    GCP_DEPLOY_SERVICE_ACCOUNT  $DEPLOY_SA
    GCP_WIF_PROVIDER            $PROVIDER_NAME

EOF
