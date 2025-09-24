# 🚀 Supabase Quick Setup Guide for Life Hotlist

## Step 1: Create Your Supabase Account (2 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" (it's free!)
3. Sign up with GitHub or email
4. Create a new project:
   - **Project name**: `hotlist` (or whatever you like)
   - **Database Password**: Choose a strong password (you won't need this for the app)
   - **Region**: Choose the closest to you
   - Click "Create new project" (takes ~2 minutes to provision)

## Step 2: Set Up Your Database (1 minute)

1. Once your project is ready, click on "SQL Editor" in the left sidebar
2. Click "New query"
3. Copy ALL the contents from your `supabase_setup.sql` file
4. Paste it into the SQL editor
5. Click "Run" (green play button)
6. You should see "Success. No rows returned"

## Step 3: Enable Authentication (1 minute)

1. Go to "Authentication" → "Providers" in the left sidebar
2. Under "Email", make sure it's enabled (should be by default)
3. Optional: Enable "Confirm email" to require email verification
4. That's it! Email magic links are ready to use

## Step 4: Get Your Credentials (30 seconds)

1. Go to "Settings" → "API" in the left sidebar
2. You'll need two things:
   - **Project URL**: Copy the URL (looks like `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public key**: Copy the long key starting with `eyJ...`

## Step 5: Connect Your App (30 seconds)

1. Open your Life Hotlist app
2. Click the "☁️" cloud icon in the header
3. If first time:
   - Click "Advanced: Configure Supabase"
   - Paste your Project URL
   - Paste your anon key
4. Enter your email address
5. Click "Send Sign-in Link"
6. Check your email and click the magic link
7. You're connected! 🎉

## What Happens Next?

- Your data automatically syncs to the cloud every time you make changes
- Access your data from any device by signing in with the same email
- Your local data continues to work offline
- When online, changes sync automatically

## Testing Your Setup

1. Add or edit a client in your hotlist
2. Open the app in another browser or incognito window
3. Sign in with the same email
4. Your data should appear automatically!

## Troubleshooting

**Email not arriving?**
- Check spam folder
- Make sure you entered the correct email
- Wait 1-2 minutes (sometimes there's a delay)

**Sign-in link expired?**
- Request a new one (links expire after 1 hour)

**Data not syncing?**
- Check you're signed in (look for your email in the cloud widget)
- Make sure you have internet connection
- Try refreshing the page

## Security Notes

✅ Your data is private - only you can see it
✅ All data is encrypted in transit
✅ Supabase uses Row Level Security - even database admins can't see your data
✅ You can delete your account anytime from Supabase dashboard

## Advanced: Multiple Devices

Want to use the app on multiple devices?
1. Sign in with the same email on each device
2. Your data syncs automatically
3. Changes made on one device appear on others within seconds

## Need Help?

- Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Check the app's SUPABASE_SETUP.md for more details
- The app works perfectly fine without cloud sync - it's optional!