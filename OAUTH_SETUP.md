# Google OAuth Configuration

## Step 1: In Supabase Dashboard
https://supabase.com/dashboard/project/yoxzlejphrhtuisnptor/settings/auth

### Under "URL Configuration":
- **Site URL**: `https://hotlists.vercel.app`
- **Redirect URLs**: Add these:
  ```
  https://hotlists.vercel.app/*
  http://localhost:3000/*
  ```

### Under "OAuth Providers" → Google:
- Enable Google
- Copy the "Callback URL" shown (should be: `https://yoxzlejphrhtuisnptor.supabase.co/auth/v1/callback`)

## Step 2: In Google Cloud Console
https://console.cloud.google.com/apis/credentials

### Find your OAuth 2.0 Client:
1. Click on your OAuth client
2. Under "Authorized redirect URIs", add:
   ```
   https://yoxzlejphrhtuisnptor.supabase.co/auth/v1/callback
   ```
3. Save

## How the Flow Works:

```
Your App (hotlists.vercel.app)
    ↓ (user clicks "Sign in with Google")
Google OAuth
    ↓ (user signs in)
Supabase Callback (yoxzlejphrhtuisnptor.supabase.co/auth/v1/callback)
    ↓ (processes auth)
Your App (hotlists.vercel.app) - final redirect
```

## Common Mistakes:
❌ Don't put `hotlists.vercel.app` in Google's redirect URIs
✅ Do put `yoxzlejphrhtuisnptor.supabase.co/auth/v1/callback` in Google's redirect URIs

❌ Don't forget to add `hotlists.vercel.app` to Supabase's redirect URLs
✅ Do add your app URL to Supabase's URL Configuration