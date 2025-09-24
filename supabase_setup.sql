-- Supabase setup for Hotlist app
-- Run this SQL in your Supabase SQL editor

-- Create the hotlist_data table
CREATE TABLE IF NOT EXISTS hotlist_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE hotlist_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to allow re-running this script)
DROP POLICY IF EXISTS "Users can view their own data" ON hotlist_data;
DROP POLICY IF EXISTS "Users can insert their own data" ON hotlist_data;
DROP POLICY IF EXISTS "Users can update their own data" ON hotlist_data;
DROP POLICY IF EXISTS "Users can delete their own data" ON hotlist_data;

-- Create policy to allow users to only see and modify their own data
CREATE POLICY "Users can view their own data" ON hotlist_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data" ON hotlist_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" ON hotlist_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own data" ON hotlist_data
  FOR DELETE USING (auth.uid() = user_id);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_hotlist_data_user_id ON hotlist_data(user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_hotlist_data_updated_at BEFORE UPDATE
  ON hotlist_data FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();