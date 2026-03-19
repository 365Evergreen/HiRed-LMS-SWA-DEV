const { ManagedIdentityCredential } = require('@azure/identity');
const fetch = require('node-fetch');

// Dataverse proxy function
// - Uses Managed Identity by default (enable system-assigned identity on the Function App)
// - Falls back to client credentials when USE_MANAGED_IDENTITY is set to '0'

module.exports = async function (context, req) {
  context.log('Dataverse proxy called:', req.method, req.url);

  const dataverseUrl = process.env.DATAVERSE_URL;
  if (!dataverseUrl) {
    context.log('Missing DATAVERSE_URL env var');
    context.res = { status: 400, body: { error: 'DATAVERSE_URL not configured' } };
    return;
  }

  try {
    let accessToken;

    if (process.env.USE_MANAGED_IDENTITY !== '0') {
      // Use managed identity
      const credential = new ManagedIdentityCredential();
      const scope = `${dataverseUrl}/.default`;
      context.log('Acquiring token via Managed Identity for scope', scope);
      const token = await credential.getToken(scope);
      if (!token) throw new Error('ManagedIdentityCredential failed to acquire token');
      accessToken = token.token;
    } else {
      // Fallback: client credentials (useful for local dev)
      const tenantId = process.env.TENANT_ID;
      const clientId = process.env.DATAVERSE_CLIENT_ID;
      const clientSecret = process.env.DATAVERSE_CLIENT_SECRET;
      if (!tenantId || !clientId || !clientSecret) {
        throw new Error('Client credentials not configured (TENANT_ID, DATAVERSE_CLIENT_ID, DATAVERSE_CLIENT_SECRET)');
      }
      const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
      const params = new URLSearchParams();
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);
      params.append('grant_type', 'client_credentials');
      params.append('scope', `${dataverseUrl}/.default`);

      context.log('Acquiring token via client credentials');
      const tokenResp = await fetch(tokenUrl, { method: 'POST', body: params });
      const tokenBody = await tokenResp.json();
      if (!tokenResp.ok) {
        throw new Error(`Token endpoint error: ${JSON.stringify(tokenBody)}`);
      }
      accessToken = tokenBody.access_token;
    }

    // Example: GET list of courses from e365_learningcourses (top 10)
    const requestUrl = `${dataverseUrl}/api/data/v9.2/e365_learningcourses?$select=e365_learningcourseid,e365_name&$top=10`;
    context.log('Requesting Dataverse:', requestUrl);
    const resp = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });

    if (!resp.ok) {
      const text = await resp.text();
      context.log('Dataverse returned error', resp.status, text);
      context.res = { status: 502, body: { error: 'Dataverse request failed', status: resp.status, details: text } };
      return;
    }

    const body = await resp.json();
    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body
    };
  } catch (err) {
    context.log.error('Dataverse proxy error', err);
    context.res = { status: 500, body: { error: err.message } };
  }
};
