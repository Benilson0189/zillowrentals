-- Create a security definer function to check if a phone exists
-- This allows password recovery to work without exposing user data
CREATE OR REPLACE FUNCTION public.phone_exists(phone_number text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE phone = phone_number
  )
$$;