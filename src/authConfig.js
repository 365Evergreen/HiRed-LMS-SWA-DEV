// Placeholder MSAL config — replace with your App Registration values
export const msalConfig = {
  auth: {
    clientId: '<YOUR_CLIENT_ID>',
    authority: 'https://login.microsoftonline.com/<YOUR_TENANT_ID>',
    redirectUri: window.location.origin
  }
}
