-- Drop the problematic RLS policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can view profiles for referrals" ON public.profiles;

-- Create a security definer function to check referral relationship
CREATE OR REPLACE FUNCTION public.is_referral_related(_profile_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p1
    WHERE p1.user_id = _user_id
    AND (p1.referred_by = _profile_id OR EXISTS (
      SELECT 1 FROM public.profiles p2
      WHERE p2.id = _profile_id AND p2.referred_by = p1.id
    ))
  )
$$;

-- Create new policy using the security definer function
CREATE POLICY "Users can view profiles for referrals"
ON public.profiles
FOR SELECT
USING (public.is_referral_related(id, auth.uid()));