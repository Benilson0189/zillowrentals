import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useBalance = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['balance', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('user_balances')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useInvestmentPlans = () => {
  return useQuery({
    queryKey: ['investment_plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('is_active', true)
        .order('min_amount', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUserInvestments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user_investments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('user_investments')
        .select(`
          *,
          plan:investment_plans(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useTransactions = (type?: 'deposit' | 'withdrawal') => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transactions', user?.id, type],
    queryFn: async () => {
      if (!user?.id) return [];
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useTeamMembers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['team_members', user?.id],
    queryFn: async () => {
      if (!user?.id) return { level1: [], levelB: [], levelC: [] };
      
      // Get current user's profile
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!myProfile) return { level1: [], levelB: [], levelC: [] };

      // Get level 1 referrals
      const { data: level1 } = await supabase
        .from('profiles')
        .select('*')
        .eq('referred_by', myProfile.id);

      // Get level B referrals (referrals of level 1)
      const level1Ids = (level1 || []).map(p => p.id);
      const { data: levelB } = level1Ids.length > 0 
        ? await supabase
            .from('profiles')
            .select('*')
            .in('referred_by', level1Ids)
        : { data: [] };

      // Get level C referrals (referrals of level B)
      const levelBIds = (levelB || []).map(p => p.id);
      const { data: levelC } = levelBIds.length > 0
        ? await supabase
            .from('profiles')
            .select('*')
            .in('referred_by', levelBIds)
        : { data: [] };

      return {
        level1: level1 || [],
        levelB: levelB || [],
        levelC: levelC || [],
      };
    },
    enabled: !!user?.id,
  });
};
