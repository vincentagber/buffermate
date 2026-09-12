# Authentication Setup Guide

This guide covers setting up all authentication methods for Buffermate: password-based login, magic links, and OAuth (Google/GitHub).

## Quick Start

### 1. Create Test Users

Run the seed script to create test accounts:

```bash
npm run seed
```

**Test Credentials:**
- **Email:** demo@buffermate.app
- **Password:** Demo@12345

---

## 2. Disable Email Verification (Optional)

To allow users to sign up without email confirmation:

1. Go to [Supabase Dashboard](https://app.supabase.com/project/sgsmadjmfwgvtbqrmbhw)
2. Navigate to **Authentication** → **Providers** → **Email**
3. Toggle OFF: **"Confirm email"**
4. Click **Save**

This allows immediate signup without requiring email verification.

---

## 3. Setup OAuth Authentication

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the "Google+ API"
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen:
   - User Type: External
   - Add required fields (app name, user support email, etc.)
6. Create credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://sgsmadjmfwgvtbqrmbhw.supabase.co/auth/v1/callback`
7. Copy Client ID and Client Secret

**In Supabase:**
1. Navigate to **Authentication** → **Providers** → **Google**
2. Paste Client ID and Client Secret
3. Click **Save**

### GitHub OAuth

1. Go to [GitHub Settings](https://github.com/settings/developers) → OAuth Apps
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** Buffermate
   - **Homepage URL:** `https://yourdomain.com`
   - **Authorization callback URL:** `https://sgsmadjmfwgvtbqrmbhw.supabase.co/auth/v1/callback`
4. Copy Client ID and generate Client Secret
5. Save credentials

**In Supabase:**
1. Navigate to **Authentication** → **Providers** → **GitHub**
2. Paste Client ID and Client Secret
3. Click **Save**

---

## 4. Magic Link Authentication

Magic links are automatically enabled in Supabase. Users can:
1. Enter their email on the login page
2. Select "Magic Link" tab
3. Click "Sign In with Magic Link"
4. Check email for sign-in link
5. Click link to automatically log in

No additional configuration needed! ✨

---

## 5. Testing the Authentication Flow

### Test Password Login
```bash
npm run dev
# Navigate to http://localhost:3000/login
# Use: demo@buffermate.app / Demo@12345
```

### Test Magic Link
1. Navigate to login page
2. Select "Magic Link" tab
3. Enter any email
4. Check console/email for magic link
5. Click the link to sign in

### Test OAuth
1. Navigate to login page
2. Scroll to "Or continue with"
3. Click Google or GitHub button
4. Complete OAuth flow in provider's app
5. Should redirect to dashboard

---

## 6. Environment Variables

Required variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://sgsmadjmfwgvtbqrmbhw.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 7. Troubleshooting

### OAuth Redirect Loop
- Check that redirect URL matches exactly in OAuth provider settings
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly
- Clear browser cookies and try again

### Magic Link Not Received
- Check email spam folder
- Verify email is correct (case-sensitive)
- Check Supabase email logs in dashboard

### Session Issues
- Clear browser cookies for localhost/your domain
- Restart dev server
- Check that Supabase credentials are correct

---

## 8. Architecture

- **Client Auth:** `src/lib/supabase/client.ts` - Browser-side Supabase client
- **Server Auth:** `src/lib/supabase/server.ts` - Server component Supabase client
- **Middleware:** `middleware.ts` - Route protection and session handling
- **Auth Context:** `src/lib/auth-context.tsx` - Global auth state
- **OAuth Config:** `src/lib/oauth-config.ts` - OAuth provider configuration
- **Magic Link:** `src/lib/magic-link.ts` - Passwordless sign-in
- **Callback Handler:** `src/app/api/auth/callback/route.ts` - OAuth/magic link callback

---

## Next Steps

1. ✅ Deploy to production environment
2. ✅ Configure production domain in OAuth providers
3. ✅ Set up email templates in Supabase dashboard
4. ✅ Enable MFA (multi-factor authentication) for enhanced security
5. ✅ Monitor authentication logs and user activity

---

For more details, see:
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Auth Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching)
