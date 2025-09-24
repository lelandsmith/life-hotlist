# Hotlist Cloud Sync & Teams Setup Instructions

## Quick Setup Guide

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project" and fill in:
   - Project name: `hotlist` (or any name you prefer)
   - Database Password: (save this somewhere safe)
   - Region: Choose the closest to your location
3. Wait ~2 minutes for the project to be created

### Step 2: Set Up Database

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click "New Query"
3. Copy and paste the contents of `supabase_setup.sql`
4. Click "Run" to execute the SQL
5. If using Teams feature, also run `supabase_teams_setup.sql`

### Step 3: Get Your Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. You'll need two values:
   - **Project URL**: Looks like `https://xxxxxxxxxxxxx.supabase.co`
   - **Anon/Public Key**: A long string starting with `eyJ...`

### Step 4: Update the Code

1. Open `index.html` in a text editor
2. Find these lines near the top of the `<script>` section (around line 1796):
```javascript
var SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
var SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```
3. Replace with your actual values:
```javascript
var SUPABASE_URL = 'https://xxxxxxxxxxxxx.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

4. If using Teams feature, also update `teams-dashboard.html` (around line 924) with the same credentials

### Step 5: Enable Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email settings if needed (defaults work fine for testing)

### Step 6: Deploy Your Changes

Deploy your updated files to your web server or hosting platform (Vercel, Netlify, etc.)

## Using Cloud Sync

### First Time Sign In

1. Click **"Cloud sync"** in the app
2. Enter your email address
3. Click **"Send Magic Link"**
4. Check your email for the sign-in link
5. Click the link in the email to sign in
6. Return to the app - you're now synced!

### Features Available After Setup

- ✅ **Automatic cloud backup** of all your data
- ✅ **Cross-device sync** - access from anywhere
- ✅ **Teams Dashboard** - track metrics and compete with partners
- ✅ **Accountability Partners** - share progress with colleagues
- ✅ **Gamification** - earn badges and track streaks

## Troubleshooting

### "Supabase not configured" Error
- Double-check that you've replaced both `SUPABASE_URL` and `SUPABASE_ANON_KEY` with your actual values
- Make sure there are no typos in the credentials
- Verify the credentials match what's shown in Supabase dashboard

### Magic Link Not Received
- Check spam/junk folder
- Verify email provider is enabled in Supabase
- Try resending after a few minutes

### Teams Link Not Appearing
- Make sure you're signed in via Cloud Sync first
- Check that the credentials are properly configured
- Refresh the page after signing in

## Security Notes

- The anon/public key is safe to include in frontend code - it's designed for this
- Row Level Security (RLS) ensures users can only access their own data
- Never share your database password or service role key
- Each user's data is isolated and encrypted

## Optional: Custom Domain for Emails

To use your own domain for magic link emails:
1. Go to **Authentication** → **Email Templates** in Supabase
2. Configure SMTP settings with your email provider
3. Customize the email templates as needed

## Support

If you encounter issues:
1. Check the browser console for error messages (F12 → Console)
2. Verify all SQL scripts ran successfully
3. Ensure Supabase project is active (free tier pauses after 1 week of inactivity)
4. Review the Supabase logs in the dashboard

## Next Steps

After setup:
1. Test cloud sync by adding a client and checking from another device
2. Invite team members to use accountability features
3. Monitor your progress in the Teams Dashboard
4. Customize badges and goals for your team