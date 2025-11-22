# Social Provider Setup

## Mock Provider
For testing, you can use the built-in Mock Provider. No setup is required. Just click "Connect Mock Provider" in the dashboard.

## X (Twitter)
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard).
2. Create a Project and App.
3. Enable "User authentication settings".
4. Set "App permissions" to "Read and write".
5. Set "Type of App" to "Web App, Automated App or Bot".
6. Set "Callback URI / Redirect URL" to `http://localhost:3000/api/social/callback?provider=x`.
7. Set "Website URL" to `http://localhost:3000`.
8. Copy "Client ID" and "Client Secret" to `.env.local` as `OAUTH_X_CLIENT_ID` and `OAUTH_X_CLIENT_SECRET`.

## Facebook / Instagram
1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Create an App (Type: Business).
3. Add "Facebook Login for Business" product.
4. Add `http://localhost:3000/api/social/callback?provider=facebook` to "Valid OAuth Redirect URIs".
5. Copy "App ID" and "App Secret" to `.env.local`.

## LinkedIn
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/).
2. Create an App.
3. Request "Share on LinkedIn" and "Sign In with LinkedIn" products.
4. Add `http://localhost:3000/api/social/callback?provider=linkedin` to "Authorized Redirect URLs".
5. Copy "Client ID" and "Client Secret" to `.env.local`.
