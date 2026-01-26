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

      // First check if user has sufficient balance
      const { data: balanceData, error: balanceError } = await supabase
        .from('user_balances')
        .select('balance, total_invested')
        .eq('user_id', user.id)
        .single();

      if (balanceError) throw balanceError;

      const currentBalance = balanceData?.balance || 0;
      if (currentBalance < amount) {
        throw new Error('Saldo insuficiente');
      }

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

      // Deduct balance and update total_invested
      const newBalance = currentBalance - amount;
      const newTotalInvested = (balanceData?.total_invested || 0) + amount;

      const { error: updateError } = await supabase
        .from('user_balances')
        .update({ 
          balance: newBalance, 
          total_invested: newTotalInvested,
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_investments'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
};
