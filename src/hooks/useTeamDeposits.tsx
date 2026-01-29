import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface TeamMemberDeposit {
  user_id: string;
  total_deposited: number;
}

export const useTeamDeposits = (userIds: string[]) => {
  return useQuery({
    queryKey: ['team_deposits', userIds],
    queryFn: async () => {
      if (!userIds.length) return {};

      // Get approved deposits for all referred users
      const { data, error } = await supabase
        .from('transactions')
        .select('user_id, amount')
        .in('user_id', userIds)
        .eq('type', 'deposit')
        .eq('status', 'approved');

      if (error) throw error;

      // Calculate total deposited per user
      const depositsByUser: Record<string, number> = {};
      data?.forEach((tx) => {
        if (!depositsByUser[tx.user_id]) {
          depositsByUser[tx.user_id] = 0;
        }
        depositsByUser[tx.user_id] += Number(tx.amount);
      });

      return depositsByUser;
    },
    enabled: userIds.length > 0,
  });
};

export const useUserHasDeposit = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user_has_deposit', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase
        .from('transactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'deposit')
        .eq('status', 'approved')
        .limit(1);

      if (error) throw error;
      return (data?.length || 0) > 0;
    },
    enabled: !!user?.id,
  });
};

export const useUserHasActiveInvestment = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user_has_active_investment', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase
        .from('user_investments')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1);

      if (error) throw error;
      return (data?.length || 0) > 0;
    },
    enabled: !!user?.id,
  });
};
