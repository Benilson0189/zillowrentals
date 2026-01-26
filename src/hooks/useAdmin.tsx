import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useIsAdmin = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['is_admin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) return false;
      return !!data;
    },
    enabled: !!user?.id,
  });
};

export const useAdminStats = () => {
  const { data: isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['admin_stats'],
    queryFn: async () => {
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get pending deposits
      const { count: pendingDeposits } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'deposit')
        .eq('status', 'pending');

      // Get pending withdrawals
      const { count: pendingWithdrawals } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'withdrawal')
        .eq('status', 'pending');

      // Get total deposited (approved)
      const { data: depositsData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'deposit')
        .eq('status', 'approved');

      const totalDeposited = depositsData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      return {
        usersCount: usersCount || 0,
        pendingDeposits: pendingDeposits || 0,
        pendingWithdrawals: pendingWithdrawals || 0,
        totalDeposited,
      };
    },
    enabled: isAdmin === true,
  });
};

export const useAllTransactions = (type?: 'deposit' | 'withdrawal', status?: string) => {
  const { data: isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['all_transactions', type, status],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          linked_account:linked_accounts(*)
        `)
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });
};

export const useAllProfiles = (searchTerm?: string) => {
  const { data: isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['all_profiles', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (searchTerm && searchTerm.trim()) {
        query = query.or(`phone.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });
};

export const useAllLinkedAccounts = () => {
  const { data: isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['all_linked_accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('linked_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });
};

export const useAllUserInvestments = () => {
  const { data: isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['all_user_investments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_investments')
        .select(`
          *,
          plan:investment_plans(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      transactionId, 
      status, 
      updateBalance 
    }: { 
      transactionId: string; 
      status: 'approved' | 'rejected';
      updateBalance?: { userId: string; amount: number; type: 'deposit' | 'withdrawal' };
    }) => {
      // Update transaction status
      const { error: txError } = await supabase
        .from('transactions')
        .update({ 
          status, 
          processed_at: new Date().toISOString() 
        })
        .eq('id', transactionId);

      if (txError) throw txError;

      // If approved, update user balance
      if (status === 'approved' && updateBalance) {
        const { data: currentBalance } = await supabase
          .from('user_balances')
          .select('balance')
          .eq('user_id', updateBalance.userId)
          .single();

        const newBalance = updateBalance.type === 'deposit'
          ? (currentBalance?.balance || 0) + updateBalance.amount
          : (currentBalance?.balance || 0) - updateBalance.amount;

        const { error: balanceError } = await supabase
          .from('user_balances')
          .update({ balance: newBalance, updated_at: new Date().toISOString() })
          .eq('user_id', updateBalance.userId);

        if (balanceError) throw balanceError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_transactions'] });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
    },
  });
};
