-- Add column to track last payout timestamp
ALTER TABLE public.user_investments 
ADD COLUMN IF NOT EXISTS last_payout_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Enable pg_cron and pg_net extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage to postgres user
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;