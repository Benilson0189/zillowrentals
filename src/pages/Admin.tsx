import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Eye,
  Check,
  X,
  FileText,
  CreditCard,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  useIsAdmin, 
  useAdminStats, 
  useAllTransactions, 
  useAllProfiles,
  useUpdateTransaction 
} from '@/hooks/useAdmin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: stats } = useAdminStats();
  const { data: allTransactions } = useAllTransactions();
  const { data: allProfiles } = useAllProfiles();
  const updateTransaction = useUpdateTransaction();

  const [activeTab, setActiveTab] = useState('deposits');
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  // Filter transactions by type
  const deposits = allTransactions?.filter(t => t.type === 'deposit') || [];
  const withdrawals = allTransactions?.filter(t => t.type === 'withdrawal') || [];

  const handleApprove = async (transaction: any) => {
    try {
      await updateTransaction.mutateAsync({
        transactionId: transaction.id,
        status: 'approved',
        updateBalance: {
          userId: transaction.user_id,
          amount: Number(transaction.amount),
          type: transaction.type,
        },
      });
      toast.success('Transação aprovada');
    } catch (error) {
      toast.error('Erro ao aprovar transação');
    }
  };

  const handleReject = async (transaction: any) => {
    try {
      await updateTransaction.mutateAsync({
        transactionId: transaction.id,
        status: 'rejected',
      });
      toast.success('Transação rejeitada');
    } catch (error) {
      toast.error('Erro ao rejeitar transação');
    }
  };

  // Get profile phone for a user
  const getProfilePhone = (userId: string) => {
    const profile = allProfiles?.find(p => p.user_id === userId);
    return profile?.phone || 'N/A';
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Shield className="w-16 h-16 text-destructive" />
        <h1 className="text-xl font-bold text-foreground">Acesso Negado</h1>
        <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="glass-card mx-3 mt-3 p-3 flex items-center gap-2">
        <button onClick={() => navigate('/dashboard')} className="p-1.5 rounded-full hover:bg-foreground/10">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Painel Administrativo</h1>
      </header>

      {/* Stats Grid */}
      <div className="mx-3 mt-3 grid grid-cols-2 gap-3">
        <div className="glass-card p-3">
          <Users className="w-5 h-5 text-secondary mb-1" />
          <p className="text-2xl font-bold text-foreground">
            {stats?.usersCount.toLocaleString('pt-AO') || 0}
          </p>
          <p className="text-xs text-muted-foreground">Usuários</p>
        </div>
        <div className="glass-card p-3">
          <Clock className="w-5 h-5 text-warning mb-1" />
          <p className="text-2xl font-bold text-foreground">
            {stats?.pendingDeposits || 0}
          </p>
          <p className="text-xs text-muted-foreground">Depósitos Pendentes</p>
        </div>
        <div className="glass-card p-3">
          <DollarSign className="w-5 h-5 text-destructive mb-1" />
          <p className="text-2xl font-bold text-foreground">
            {stats?.pendingWithdrawals || 0}
          </p>
          <p className="text-xs text-muted-foreground">Saques Pendentes</p>
        </div>
        <div className="glass-card p-3">
          <TrendingUp className="w-5 h-5 text-success mb-1" />
          <p className="text-2xl font-bold text-foreground">
            {Number(stats?.totalDeposited || 0).toLocaleString('pt-AO')}
          </p>
          <p className="text-xs text-muted-foreground">Total Depositado</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-3 mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-5 bg-foreground/5">
            <TabsTrigger value="deposits" className="text-xs">
              <FileText className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="text-xs">
              <DollarSign className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs">
              <Users className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="accounts" className="text-xs">
              <CreditCard className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="investments" className="text-xs">
              <TrendingUp className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          {/* Deposits Tab */}
          <TabsContent value="deposits" className="mt-3 space-y-3">
            {deposits.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum depósito</p>
            ) : (
              deposits.map((tx) => (
                <TransactionCard 
                  key={tx.id} 
                  transaction={tx} 
                  phone={getProfilePhone(tx.user_id)}
                  onApprove={() => handleApprove(tx)}
                  onReject={() => handleReject(tx)}
                  onViewProof={() => setSelectedProof(tx.proof_url)}
                  isPending={updateTransaction.isPending}
                />
              ))
            )}
          </TabsContent>

          {/* Withdrawals Tab */}
          <TabsContent value="withdrawals" className="mt-3 space-y-3">
            {withdrawals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum saque</p>
            ) : (
              withdrawals.map((tx) => (
                <TransactionCard 
                  key={tx.id} 
                  transaction={tx} 
                  phone={getProfilePhone(tx.user_id)}
                  onApprove={() => handleApprove(tx)}
                  onReject={() => handleReject(tx)}
                  isPending={updateTransaction.isPending}
                  showAccount
                />
              ))
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-3 space-y-2">
            {allProfiles?.map((profile) => (
              <div key={profile.id} className="glass-card p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {profile.full_name || 'Sem nome'}
                    </p>
                    <p className="text-xs text-muted-foreground">{profile.phone}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(profile.created_at).toLocaleDateString('pt-AO')}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="mt-3">
            <p className="text-center text-muted-foreground py-8">Em desenvolvimento</p>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="mt-3">
            <p className="text-center text-muted-foreground py-8">Em desenvolvimento</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Proof Modal */}
      <Dialog open={!!selectedProof} onOpenChange={() => setSelectedProof(null)}>
        <DialogContent className="bg-background border-foreground/10">
          <DialogHeader>
            <DialogTitle className="text-foreground">Comprovativo</DialogTitle>
          </DialogHeader>
          {selectedProof && (
            <img 
              src={selectedProof} 
              alt="Comprovativo" 
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface TransactionCardProps {
  transaction: any;
  phone: string;
  onApprove: () => void;
  onReject: () => void;
  onViewProof?: () => void;
  isPending: boolean;
  showAccount?: boolean;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  phone,
  onApprove,
  onReject,
  onViewProof,
  isPending,
  showAccount,
}) => {
  const statusColors: Record<string, string> = {
    pending: 'text-warning bg-warning/10',
    approved: 'text-success bg-success/10',
    rejected: 'text-destructive bg-destructive/10',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pendente',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
  };

  return (
    <div className="glass-card p-3 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-lg font-bold text-foreground">
            {Number(transaction.amount).toLocaleString('pt-AO')} Kz
          </p>
          <p className="text-xs text-secondary flex items-center gap-1">
            📱 {phone}
          </p>
          <p className="text-xs text-muted-foreground">
            {transaction.payment_method || 'N/A'} • {new Date(transaction.created_at).toLocaleDateString('pt-AO')}
          </p>
          {showAccount && transaction.linked_account && (
            <p className="text-xs text-muted-foreground mt-1">
              {transaction.linked_account.bank_name} - {transaction.linked_account.account_number}
            </p>
          )}
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[transaction.status]}`}>
          {statusLabels[transaction.status]}
        </span>
      </div>

      {/* View Proof Button */}
      {onViewProof && transaction.proof_url && (
        <button 
          onClick={onViewProof}
          className="w-full py-2 rounded-lg border border-success text-success flex items-center justify-center gap-2 text-sm"
        >
          <Eye className="w-4 h-4" />
          Ver Comprovativo
        </button>
      )}

      {/* Action Buttons (only for pending) */}
      {transaction.status === 'pending' && (
        <div className="flex gap-2">
          <button 
            onClick={onApprove}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg bg-success text-white flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Aprovar
          </button>
          <button 
            onClick={onReject}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg bg-destructive text-white flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Rejeitar
          </button>
        </div>
      )}
    </div>
  );
};

export default Admin;
