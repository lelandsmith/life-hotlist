# Google Authentication Setup for Hotlist

## Prerequisites
- Supabase project (already configured)
- Google Cloud Console account

## Step 1: Configure Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure OAuth consent screen first:
     - Choose "External" user type
     - Fill in app name: "Hotlist"
     - Add your email as support email
     - Add authorized domains: `supabase.co`
     - Save and continue

5. Create OAuth client:
   - Application type: "Web application"
   - Name: "Hotlist Supabase"
   - Authorized redirect URIs:
     - `https://yoxzlejphrhtuisnptor.supabase.co/auth/v1/callback`
   - Click "Create"
   - Copy the Client ID and Client Secret

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (yoxzlejphrhtuisnptor)
3. Navigate to "Authentication" > "Providers"
4. Find "Google" in the list
5. Toggle it ON
6. Enter the credentials from Google Cloud Console:
   - Client ID: [paste from Google]
   - Client Secret: [paste from Google]
7. Click "Save"

## Step 3: Configure Redirect URLs in Supabase

1. Still in Supabase Dashboard
2. Go to "Authentication" > "URL Configuration"
3. Add to "Redirect URLs":
   - `https://hotlists.vercel.app`
   - `https://*.vercel.app`
   - `http://localhost:3000`
   - `http://localhost:5173`
   - Any other domains you use

## Step 4: Test the Integration

1. Visit https://hotlists.vercel.app
2. Click "Cloud sync"
3. Click "Continue with Google"
4. Sign in with your Google account
5. You should be redirected back and logged in

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the redirect URI in Google Console exactly matches Supabase's callback URL
- The format is: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`

### "Google sign-in failed" error
- Check that Google provider is enabled in Supabase
- Verify Client ID and Secret are correctly entered
- Check browser console for detailed error messages

### Users not staying logged in
- Verify that your domain is in the Redirect URLs list in Supabase
- Check that cookies are enabled in the browser

## Security Notes

- Never commit Google Client Secret to version control
- Use environment variables in production deployments
- Regularly rotate credentials
- Monitor usage in Google Cloud Console