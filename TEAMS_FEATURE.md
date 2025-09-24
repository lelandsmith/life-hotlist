# Teams & Accountability Feature

## Overview
The Teams feature adds accountability partnerships, gamification, and collaborative tools to your Hotlist application. Agents can partner with each other to share progress, compete on leaderboards, and provide mutual encouragement.

## Setup Instructions

### 1. Database Setup (Supabase)

1. **Run the Teams SQL Setup**
   - Open your Supabase SQL Editor
   - Run the contents of `supabase_teams_setup.sql`
   - This creates all necessary tables and functions for:
     - User profiles
     - Accountability partnerships
     - Activity metrics tracking
     - Badges and achievements
     - Leaderboards
     - Activity feeds

### 2. Enable Teams Feature

The Teams feature is automatically enabled when:
- Supabase is configured
- User is authenticated (signed in via Cloud Sync)
- The "Teams" link appears in the main navigation

## Features

### 📊 Dashboard
- **Activity Tracking**: Automatically tracks calls, quotes, applications, and follow-ups
- **Streaks**: Maintains daily activity streaks with visual indicators
- **Pipeline Metrics**: Shows active prospects and conversion rates
- **Real-time Updates**: Live feed of your activity and partner updates

### 🤝 Accountability Partners
- **Invite Partners**: Send invitations to other agents via email
- **Privacy Controls**: Choose what metrics to share with partners
- **Partner Feed**: See partner achievements and send encouragement
- **Mutual Visibility**: Partners can see shared metrics and progress

### 🏆 Gamification
- **Badges**: Earn achievements for milestones
  - Call Champion (50 calls)
  - Call Master (100 calls)
  - Week Warrior (7-day streak)
  - Consistency King (30-day streak)
  - And more...
- **Leaderboards**: Compete with accountability partners
- **Streaks**: Track consecutive days of activity

### 📈 Metrics Tracked
- **Activity Metrics**:
  - Calls made
  - Quotes sent
  - Applications sent
  - Policies bound
  - Follow-ups completed
  - New contacts added
- **Time Metrics**:
  - Active minutes per day
  - First/last activity times
- **Pipeline Metrics**:
  - Total prospects
  - Hot/warm prospect counts
  - Conversion rates

## How It Works

### Automatic Activity Tracking
The system automatically tracks activities when you:
1. **Add a new contact** → Tracks as "new_contacts_added"
2. **Move to Quote stage** → Tracks as "quotes_sent"
3. **Move to Application stage** → Tracks as "applications_sent"
4. **Move to Purchased stage** → Tracks as "policies_bound"
5. **Complete a follow-up** → Tracks as "follow_ups_completed"

### Partner Sharing
1. Navigate to Teams Dashboard
2. Click "Invite Partner"
3. Enter partner's email
4. Configure sharing settings:
   - Activity metrics
   - Pipeline data
   - Service metrics
   - Streak information
5. Partner receives invitation and can accept/decline

### Privacy & Control
- **Granular Sharing**: Control exactly what metrics partners can see
- **Notification Preferences**: Choose which updates you receive
- **Remove Partners**: Can remove partnerships at any time
- **Data Isolation**: Each user's client data remains private

## Technical Architecture

### Database Tables
- `user_profiles`: User settings and preferences
- `accountability_partners`: Partnership relationships
- `activity_metrics`: Daily activity snapshots
- `user_streaks`: Streak tracking
- `user_badges`: Earned achievements
- `encouragements`: Partner interactions
- `notifications`: System notifications
- `leaderboard_snapshots`: Period leaderboards
- `activity_feed`: Real-time activity events

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only view their own data
- Partners can only see explicitly shared metrics
- All API calls authenticated via Supabase Auth

## Troubleshooting

### Teams Link Not Showing
- Ensure you're signed in via Cloud Sync
- Check that Supabase is properly configured
- Verify authentication is working

### Metrics Not Tracking
- Confirm the Teams SQL has been run in Supabase
- Check browser console for errors
- Ensure user profile exists in database

### Partner Invitations Not Working
- Verify email settings in Supabase
- Check that both users have accounts
- Confirm invitation status in database

## Future Enhancements
- Team/agency groupings
- Custom challenges and goals
- Coaching and mentorship features
- Advanced analytics and insights
- Mobile app notifications
- Export reports and analytics