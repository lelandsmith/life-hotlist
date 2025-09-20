# Supabase Setup for Hotlist Cloud Sync (Optional)

Cloud sync is completely optional. The app works perfectly fine with local storage only.

## Quick Setup

1. **Create a Supabase Account** (free)
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project (remember your database password)

2. **Set up the Database**
   - In your Supabase dashboard, go to the SQL Editor
   - Copy and paste the contents of `supabase_setup.sql`
   - Click "Run" to create the necessary tables and policies

3. **Get Your Project Credentials**
   - Go to Settings → API in your Supabase dashboard
   - Copy your:
     - Project URL (looks like: https://xxxxx.supabase.co)
     - Anon/Public Key (a long string starting with "eyJ...")

4. **Enable Email Authentication**
   - Go to Authentication → Providers
   - Make sure Email is enabled
   - Configure email settings if needed

5. **Configure in Hotlist**
   - When you see "Enable cloud sync" in the app
   - Enter your email address
   - Click "Advanced" and add your Project URL and Anon Key
   - Click "Send Login Link"
   - Check your email and click the link to sign in

## Privacy & Security

- Your data is encrypted in transit and at rest
- Only you can access your data (enforced by Row Level Security)
- No personal information is stored except your email address
- You can delete your account and all data at any time from Supabase dashboard

## Troubleshooting

- If sign-in link doesn't arrive, check spam folder
- Make sure you've enabled Email provider in Supabase Authentication settings
- Verify your Project URL and Anon Key are correct (no extra spaces)

## Disabling Cloud Sync

Simply click "Sign out" in the app to return to local-only storage. Your local data remains untouched.