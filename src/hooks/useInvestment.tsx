import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useCreateInvestment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, amount, durationDays }: { 
      planId: string; 
      amount: number;
      durationDays: number;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + durationDays);

      // Create investment
      const { data, error } = await supabase
        .from('user_investments')
        .insert({
          user_id: user.id,
          plan_id: planId,
          amount,
          end_date: endDate.toISOString(),
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_investments'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
};
