# Supabase Configuration Check

## Please verify these settings in your Supabase Dashboard:

### 1. Go to Authentication Settings
https://supabase.com/dashboard/project/yoxzlejphrhtuisnptor/settings/auth

### 2. Check "URL Configuration" Section
Look for **Site URL** and **Redirect URLs**

These should include:
- `https://hotlists.vercel.app` (production)
- `http://localhost:3000` (local development - optional)

### 3. Check OAuth Providers
Under **OAuth Providers**, if Google is enabled, make sure:
- Google OAuth is turned ON
- The redirect URL for Google includes `https://hotlists.vercel.app`

### 4. Check Email Settings
Under **Email Auth**:
- Is "Enable Email Signups" ON?
- Is there an "Allowed Email Domains" setting? (should be empty or include gmail.com)
- Is there a "Allowed Emails" list? (should include emailleland@gmail.com)

## Current Issues We're Seeing:

1. ✅ Magic links work but ONLY for emailleland@gmail.com (whitelist enabled)
2. ❌ getSession() times out after 3+ seconds
3. ❓ Google OAuth redirects might not be configured correctly

## What to Tell Me:

1. What's listed in "Site URL"?
2. What's in "Redirect URLs"?
3. Is Google OAuth enabled?
4. What email restrictions are configured?