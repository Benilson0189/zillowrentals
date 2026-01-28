-- Add admin DELETE policies for user_investments
CREATE POLICY "Admins can delete user investments" 
ON public.user_investments 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin DELETE policies for transactions
CREATE POLICY "Admins can delete transactions" 
ON public.transactions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin DELETE policies for linked_accounts
CREATE POLICY "Admins can delete linked accounts" 
ON public.linked_accounts 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin DELETE policies for user_balances
CREATE POLICY "Admins can delete user balances" 
ON public.user_balances 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin DELETE policies for daily_checkins
CREATE POLICY "Admins can delete checkins" 
ON public.daily_checkins 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin DELETE policies for profiles
CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));