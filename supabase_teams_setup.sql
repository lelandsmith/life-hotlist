-- Teams and Accountability Features for Hotlist
-- Run this in your Supabase SQL Editor after running supabase_setup.sql

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Privacy settings
  share_activity BOOLEAN DEFAULT true,
  share_pipeline BOOLEAN DEFAULT true,
  share_service BOOLEAN DEFAULT true,
  share_streaks BOOLEAN DEFAULT true,
  -- Notification preferences
  notify_partner_progress BOOLEAN DEFAULT true,
  notify_encouragements BOOLEAN DEFAULT true,
  notify_leaderboard BOOLEAN DEFAULT true
);

-- Accountability partnerships table
CREATE TABLE IF NOT EXISTS accountability_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'removed')) DEFAULT 'pending',
  invitation_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  -- Sharing permissions (what requester shares with partner)
  share_activity BOOLEAN DEFAULT true,
  share_pipeline BOOLEAN DEFAULT true,
  share_service BOOLEAN DEFAULT true,
  share_streaks BOOLEAN DEFAULT true,
  UNIQUE(requester_id, partner_id)
);

-- Activity metrics table (daily snapshots)
CREATE TABLE IF NOT EXISTS activity_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  -- Activity counters
  calls_made INTEGER DEFAULT 0,
  quotes_sent INTEGER DEFAULT 0,
  applications_sent INTEGER DEFAULT 0,
  policies_bound INTEGER DEFAULT 0,
  follow_ups_completed INTEGER DEFAULT 0,
  new_contacts_added INTEGER DEFAULT 0,
  -- Pipeline metrics
  total_prospects INTEGER DEFAULT 0,
  hot_prospects INTEGER DEFAULT 0,
  warm_prospects INTEGER DEFAULT 0,
  -- Time metrics
  active_minutes INTEGER DEFAULT 0,
  first_activity_time TIME,
  last_activity_time TIME,
  -- Calculated fields
  conversion_rate DECIMAL(5,2),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Streaks table
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_type TEXT CHECK (streak_type IN ('daily_activity', 'calls', 'applications', 'follow_ups')),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  started_at DATE,
  ended_at DATE,
  UNIQUE(user_id, streak_type)
);

-- Badges and achievements table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  -- Badge metadata
  criteria_value INTEGER, -- e.g., 50 for "First 50 calls"
  icon TEXT, -- emoji or icon class
  rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'legendary')),
  UNIQUE(user_id, badge_type)
);

-- Encouragements and comments table
CREATE TABLE IF NOT EXISTS encouragements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  reaction_type TEXT CHECK (reaction_type IN ('cheer', 'fire', 'trophy', 'muscle', 'star', 'heart')),
  related_metric TEXT, -- e.g., 'streak_7_days', 'calls_50'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('partner_request', 'partner_accepted', 'encouragement', 'badge_earned', 'streak_milestone', 'leaderboard_change')),
  title TEXT,
  message TEXT,
  data JSONB, -- Additional notification data
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Leaderboard snapshots (weekly/monthly)
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_type TEXT CHECK (period_type IN ('weekly', 'monthly')),
  period_start DATE,
  period_end DATE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rank INTEGER,
  metric_type TEXT, -- calls, applications, policies, etc.
  metric_value INTEGER,
  partner_group_id UUID, -- To group accountability partners
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared clients table (for handoffs and collaboration)
CREATE TABLE IF NOT EXISTS shared_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL, -- Reference to client in hotlist_data
  original_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  share_type TEXT CHECK (share_type IN ('view', 'collaborate', 'transfer')),
  share_reason TEXT,
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  transferred_at TIMESTAMPTZ,
  notes TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Activity feed events (for real-time updates)
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  is_public BOOLEAN DEFAULT false, -- Visible to partners
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE encouragements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User Profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view partner profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM accountability_partners
      WHERE status = 'accepted'
      AND (
        (requester_id = auth.uid() AND partner_id = user_profiles.id) OR
        (partner_id = auth.uid() AND requester_id = user_profiles.id)
      )
    )
  );

-- Accountability Partners
CREATE POLICY "Users can view their partnerships" ON accountability_partners
  FOR SELECT USING (requester_id = auth.uid() OR partner_id = auth.uid());

CREATE POLICY "Users can create partnership requests" ON accountability_partners
  FOR INSERT WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can update their partnerships" ON accountability_partners
  FOR UPDATE USING (requester_id = auth.uid() OR partner_id = auth.uid());

-- Activity Metrics
CREATE POLICY "Users can view their own metrics" ON activity_metrics
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own metrics" ON activity_metrics
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own metrics" ON activity_metrics
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Partners can view shared metrics" ON activity_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM accountability_partners ap
      JOIN user_profiles up ON up.id = activity_metrics.user_id
      WHERE ap.status = 'accepted'
      AND (
        (ap.requester_id = auth.uid() AND ap.partner_id = activity_metrics.user_id) OR
        (ap.partner_id = auth.uid() AND ap.requester_id = activity_metrics.user_id)
      )
      AND (
        (ap.share_activity AND up.share_activity) OR
        (ap.share_pipeline AND up.share_pipeline) OR
        (ap.share_service AND up.share_service)
      )
    )
  );

-- Streaks
CREATE POLICY "Users can view their own streaks" ON user_streaks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own streaks" ON user_streaks
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Partners can view shared streaks" ON user_streaks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM accountability_partners ap
      JOIN user_profiles up ON up.id = user_streaks.user_id
      WHERE ap.status = 'accepted'
      AND (
        (ap.requester_id = auth.uid() AND ap.partner_id = user_streaks.user_id) OR
        (ap.partner_id = auth.uid() AND ap.requester_id = user_streaks.user_id)
      )
      AND ap.share_streaks = true
      AND up.share_streaks = true
    )
  );

-- Badges
CREATE POLICY "Users can view their own badges" ON user_badges
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can earn badges" ON user_badges
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Partners can view badges" ON user_badges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM accountability_partners
      WHERE status = 'accepted'
      AND (
        (requester_id = auth.uid() AND partner_id = user_badges.user_id) OR
        (partner_id = auth.uid() AND requester_id = user_badges.user_id)
      )
    )
  );

-- Encouragements
CREATE POLICY "Users can view encouragements" ON encouragements
  FOR SELECT USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

CREATE POLICY "Users can send encouragements" ON encouragements
  FOR INSERT WITH CHECK (from_user_id = auth.uid());

CREATE POLICY "Users can update their sent encouragements" ON encouragements
  FOR UPDATE USING (to_user_id = auth.uid());

-- Notifications
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Shared Clients
CREATE POLICY "Users can view shared clients" ON shared_clients
  FOR SELECT USING (original_owner_id = auth.uid() OR shared_with_id = auth.uid());

CREATE POLICY "Users can share their clients" ON shared_clients
  FOR INSERT WITH CHECK (original_owner_id = auth.uid());

CREATE POLICY "Users can update shared clients" ON shared_clients
  FOR UPDATE USING (original_owner_id = auth.uid() OR shared_with_id = auth.uid());

-- Activity Feed
CREATE POLICY "Users can view their own feed" ON activity_feed
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert to their feed" ON activity_feed
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Partners can view public feed items" ON activity_feed
  FOR SELECT USING (
    is_public = true AND
    EXISTS (
      SELECT 1 FROM accountability_partners
      WHERE status = 'accepted'
      AND (
        (requester_id = auth.uid() AND partner_id = activity_feed.user_id) OR
        (partner_id = auth.uid() AND requester_id = activity_feed.user_id)
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_accountability_partners_requester ON accountability_partners(requester_id);
CREATE INDEX idx_accountability_partners_partner ON accountability_partners(partner_id);
CREATE INDEX idx_accountability_partners_status ON accountability_partners(status);
CREATE INDEX idx_activity_metrics_user_date ON activity_metrics(user_id, date);
CREATE INDEX idx_user_streaks_user_type ON user_streaks(user_id, streak_type);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_activity_feed_user_created ON activity_feed(user_id, created_at DESC);

-- Helper functions

-- Function to calculate streaks
CREATE OR REPLACE FUNCTION update_user_streak(
  p_user_id UUID,
  p_streak_type TEXT,
  p_activity_date DATE DEFAULT CURRENT_DATE
)
RETURNS void AS $$
DECLARE
  v_last_date DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
BEGIN
  SELECT last_activity_date, current_streak, longest_streak
  INTO v_last_date, v_current_streak, v_longest_streak
  FROM user_streaks
  WHERE user_id = p_user_id AND streak_type = p_streak_type;

  IF NOT FOUND THEN
    INSERT INTO user_streaks (user_id, streak_type, current_streak, longest_streak, last_activity_date, started_at)
    VALUES (p_user_id, p_streak_type, 1, 1, p_activity_date, p_activity_date);
  ELSE
    IF v_last_date = p_activity_date - INTERVAL '1 day' THEN
      -- Continue streak
      v_current_streak := v_current_streak + 1;
      v_longest_streak := GREATEST(v_longest_streak, v_current_streak);
    ELSIF v_last_date < p_activity_date - INTERVAL '1 day' THEN
      -- Streak broken, start new
      v_current_streak := 1;
    END IF;

    UPDATE user_streaks
    SET current_streak = v_current_streak,
        longest_streak = v_longest_streak,
        last_activity_date = p_activity_date
    WHERE user_id = p_user_id AND streak_type = p_streak_type;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_total_calls INTEGER;
  v_total_apps INTEGER;
  v_streak_days INTEGER;
BEGIN
  -- Check total calls for badges
  SELECT SUM(calls_made) INTO v_total_calls
  FROM activity_metrics
  WHERE user_id = p_user_id;

  -- First 50 calls badge
  IF v_total_calls >= 50 THEN
    INSERT INTO user_badges (user_id, badge_type, badge_name, badge_description, criteria_value, icon, rarity)
    VALUES (p_user_id, 'calls_50', 'Call Champion', 'Made your first 50 calls!', 50, '📞', 'common')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;

  -- 100 calls badge
  IF v_total_calls >= 100 THEN
    INSERT INTO user_badges (user_id, badge_type, badge_name, badge_description, criteria_value, icon, rarity)
    VALUES (p_user_id, 'calls_100', 'Call Master', 'Made 100 calls!', 100, '☎️', 'uncommon')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;

  -- Check streak badges
  SELECT current_streak INTO v_streak_days
  FROM user_streaks
  WHERE user_id = p_user_id AND streak_type = 'daily_activity';

  IF v_streak_days >= 7 THEN
    INSERT INTO user_badges (user_id, badge_type, badge_name, badge_description, criteria_value, icon, rarity)
    VALUES (p_user_id, 'streak_7', 'Week Warrior', '7-day activity streak!', 7, '🔥', 'common')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;

  IF v_streak_days >= 30 THEN
    INSERT INTO user_badges (user_id, badge_type, badge_name, badge_description, criteria_value, icon, rarity)
    VALUES (p_user_id, 'streak_30', 'Consistency King', '30-day activity streak!', 30, '👑', 'rare')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql;