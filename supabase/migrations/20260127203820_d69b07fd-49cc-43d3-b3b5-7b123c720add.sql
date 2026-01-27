-- Create table for daily check-in bonuses
CREATE TABLE public.daily_checkins (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    bonus_amount NUMERIC NOT NULL,
    checked_in_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, checked_in_at)
);

-- Enable RLS
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

-- Users can view their own check-ins
CREATE POLICY "Users can view their own checkins"
ON public.daily_checkins
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own check-ins
CREATE POLICY "Users can insert their own checkins"
ON public.daily_checkins
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all check-ins
CREATE POLICY "Admins can view all checkins"
ON public.daily_checkins
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));