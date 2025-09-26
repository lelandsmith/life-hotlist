# How to Get Your Supabase API Key

## Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Sign in if needed
3. Select your project (should be "yoxzlejphrhtuisnptor" based on the URL)

## Step 2: Get the Anon Key
1. Click on the **Settings** icon (gear) in the left sidebar
2. Click on **API** under Configuration
3. You'll see two important values:

### Project URL
Should look like: `https://yoxzlejphrhtuisnptor.supabase.co`

### Project API Keys - Get the "anon public" key
- Look for **anon public** (NOT service_role)
- It should start with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Click the copy button next to it

## Step 3: Send Me Both Values
Tell me:
1. The Project URL (to confirm it matches)
2. The full anon public key

## Important Notes:
- The **anon public** key is safe to share (it's meant to be public)
- Do NOT share the **service_role** key (that one is secret)
- Make sure you're looking at the right project

## Alternative: Check Project Status
While you're in the dashboard, also check:
1. Is there any warning banner about the project being paused?
2. Under **Settings > General**, what's the project status?
3. Are there any error messages in the dashboard?