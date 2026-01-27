import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useTodayCheckin = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['todayCheckin', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('checked_in_at', today)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCheckinHistory = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['checkinHistory', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('checked_in_at', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useClaimCheckin = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Generate random bonus between 10 and 50 kz (converted to USD equivalent)
      // Assuming 1 USD ≈ 830 Kz, so 10-50 Kz ≈ 0.01-0.06 USD
      const bonusKz = Math.floor(Math.random() * 41) + 10; // 10 to 50
      const bonusUsd = bonusKz / 830; // Convert to USD
      
      const today = new Date().toISOString().split('T')[0];
      
      // Insert check-in record
      const { data: checkin, error: checkinError } = await supabase
        .from('daily_checkins')
        .insert({
          user_id: user.id,
          bonus_amount: bonusKz,
          checked_in_at: today,
        })
        .select()
        .single();
      
      if (checkinError) {
        if (checkinError.code === '23505') {
          throw new Error('Você já fez check-in hoje!');
        }
        throw checkinError;
      }
      
      // Get current balance and increment
      const { data: currentBalance } = await supabase
        .from('user_balances')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      if (currentBalance) {
        await supabase
          .from('user_balances')
          .update({
            balance: (currentBalance.balance || 0) + bonusUsd,
          })
          .eq('user_id', user.id);
      }
      
      return { bonusKz, bonusUsd, checkin };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayCheckin'] });
      queryClient.invalidateQueries({ queryKey: ['checkinHistory'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
};
