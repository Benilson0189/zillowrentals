import React, { useState } from 'react';
import defaultAvatar3D from '@/assets/default-avatar-3d.png';
import {
  X, 
  DollarSign, 
  Users, 
  TrendingUp, 
  CreditCard, 
  Trash2,
  Building2,
  ArrowDownCircle,
  ArrowUpCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useUserTransactions, 
  useUserReferrals,
  useDeleteUserInvestment,
  useDeleteUserAccount
} from '@/hooks/useAdmin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  balance: any;
  investments: any[];
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onClose,
  profile,
  balance,
  investments
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [deleteInvestmentId, setDeleteInvestmentId] = useState<string | null>(null);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  
  const { data: transactions } = useUserTransactions(profile?.user_id);
  const { data: referrals } = useUserReferrals(profile?.id);
  const deleteInvestment = useDeleteUserInvestment();
  const deleteAccount = useDeleteUserAccount();

  const handleDeleteInvestment = async () => {
    if (!deleteInvestmentId) return;
    try {
      await deleteInvestment.mutateAsync(deleteInvestmentId);
      toast.success('Plano excluído com sucesso');
      setDeleteInvestmentId(null);
    } catch (error) {
      toast.error('Erro ao excluir plano');
    }
  };

  const handleDeleteAccount = async () => {
    if (!profile?.user_id) return;
    try {
      await deleteAccount.mutateAsync(profile.user_id);
      toast.success('Conta excluída com sucesso');
      setShowDeleteAccount(false);
      onClose();
    } catch (error) {
      toast.error('Erro ao excluir conta');
    }
  };

  const userInvestments = investments?.filter(inv => inv.user_id === profile?.user_id) || [];
  
  const totalDeposits = transactions?.deposits?.reduce((sum: number, t: any) => 
    t.status === 'approved' ? sum + Number(t.amount) : sum, 0) || 0;
  
  const totalWithdrawals = transactions?.withdrawals?.reduce((sum: number, t: any) => 
    t.status === 'approved' ? sum + Number(t.amount) : sum, 0) || 0;

  if (!profile) return null;

  const getUserInitial = () => {
    if (profile.full_name && profile.full_name.trim()) {
      return profile.full_name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (profile.full_name && profile.full_name.trim()) {
      return profile.full_name;
    }
    return profile.display_id || 'Usuário';
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-background border-foreground/10 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center border-2 border-secondary/30 shadow-lg overflow-hidden">
                <img 
                  src={defaultAvatar3D} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-base font-semibold">{getDisplayName()}</p>
                <p className="text-xs text-muted-foreground font-mono">ID: {profile.display_id}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-foreground/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-success" />
                <span className="text-xs text-muted-foreground">Saldo</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                $ {Number(balance?.balance || 0).toLocaleString('en-US')}
              </p>
            </div>
            <div className="bg-foreground/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-secondary" />
                <span className="text-xs text-muted-foreground">Convidados</span>
              </div>
              <p className="text-lg font-bold text-foreground">{referrals?.total || 0}</p>
            </div>
            <div className="bg-foreground/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-warning" />
                <span className="text-xs text-muted-foreground">Comissões</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                $ {Number(balance?.commission_earnings || 0).toLocaleString('en-US')}
              </p>
            </div>
            <div className="bg-foreground/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Investido</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                $ {Number(balance?.total_invested || 0).toLocaleString('en-US')}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="w-full grid grid-cols-4 bg-foreground/5">
              <TabsTrigger value="overview" className="text-xs">Resumo</TabsTrigger>
              <TabsTrigger value="deposits" className="text-xs">Depósitos</TabsTrigger>
              <TabsTrigger value="withdrawals" className="text-xs">Saques</TabsTrigger>
              <TabsTrigger value="plans" className="text-xs">Planos</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-3 space-y-3">
              <div className="bg-foreground/5 rounded-lg p-3 space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Informações</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telefone:</span>
                    <span className="text-foreground">{profile.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Código de Convite:</span>
                    <span className="text-secondary font-mono">{profile.invite_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data de Cadastro:</span>
                    <span className="text-foreground">
                      {new Date(profile.created_at).toLocaleDateString('pt-AO')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-foreground/5 rounded-lg p-3 space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Movimentação</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <ArrowDownCircle className="w-3 h-3 text-success" /> Total Depositado:
                    </span>
                    <span className="text-success font-semibold">
                      $ {totalDeposits.toLocaleString('en-US')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <ArrowUpCircle className="w-3 h-3 text-destructive" /> Total Sacado:
                    </span>
                    <span className="text-destructive font-semibold">
                      $ {totalWithdrawals.toLocaleString('en-US')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-foreground/5 rounded-lg p-3 space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Referências ({referrals?.total || 0})</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nível A (Diretos):</span>
                    <span className="text-foreground">{referrals?.level1?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nível B:</span>
                    <span className="text-foreground">{referrals?.levelB?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nível C:</span>
                    <span className="text-foreground">{referrals?.levelC?.length || 0}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Deposits Tab */}
            <TabsContent value="deposits" className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {transactions?.deposits?.length === 0 ? (
                <p className="text-center text-muted-foreground py-4 text-sm">Nenhum depósito</p>
              ) : (
                transactions?.deposits?.map((tx: any) => (
                  <div key={tx.id} className="bg-foreground/5 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          $ {Number(tx.amount).toLocaleString('en-US')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.payment_method || 'N/A'} • {new Date(tx.created_at).toLocaleDateString('pt-AO')}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        tx.status === 'approved' ? 'bg-success/10 text-success' :
                        tx.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                        'bg-warning/10 text-warning'
                      }`}>
                        {tx.status === 'approved' ? 'Aprovado' : 
                         tx.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {/* Withdrawals Tab */}
            <TabsContent value="withdrawals" className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {transactions?.withdrawals?.length === 0 ? (
                <p className="text-center text-muted-foreground py-4 text-sm">Nenhum saque</p>
              ) : (
                transactions?.withdrawals?.map((tx: any) => (
                  <div key={tx.id} className="bg-foreground/5 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          $ {Number(tx.amount).toLocaleString('en-US')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.created_at).toLocaleDateString('pt-AO')}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        tx.status === 'approved' ? 'bg-success/10 text-success' :
                        tx.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                        'bg-warning/10 text-warning'
                      }`}>
                        {tx.status === 'approved' ? 'Aprovado' : 
                         tx.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {/* Plans Tab */}
            <TabsContent value="plans" className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {userInvestments.length === 0 ? (
                <p className="text-center text-muted-foreground py-4 text-sm">Nenhum plano ativo</p>
              ) : (
                userInvestments.map((inv: any) => {
                  const daysRemaining = Math.max(0, Math.ceil(
                    (new Date(inv.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  ));
                  return (
                    <div key={inv.id} className="bg-foreground/5 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {inv.plan?.name || 'Plano'}
                          </p>
                          <p className="text-xs text-secondary font-bold">
                            $ {Number(inv.amount).toLocaleString('en-US')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {daysRemaining} dias restantes • {inv.status === 'active' ? 'Ativo' : 'Concluído'}
                          </p>
                        </div>
                        {inv.status === 'active' && (
                          <button
                            onClick={() => setDeleteInvestmentId(inv.id)}
                            className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>
          </Tabs>

          {/* Delete Account Button */}
          <button
            onClick={() => setShowDeleteAccount(true)}
            className="w-full mt-4 py-3 rounded-lg border border-destructive text-destructive flex items-center justify-center gap-2 text-sm font-medium hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
            Excluir Conta do Usuário
          </button>
        </DialogContent>
      </Dialog>

      {/* Delete Investment Confirmation */}
      <AlertDialog open={!!deleteInvestmentId} onOpenChange={() => setDeleteInvestmentId(null)}>
        <AlertDialogContent className="bg-background border-foreground/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Plano Ativo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteInvestment}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Confirmation */}
      <AlertDialog open={showDeleteAccount} onOpenChange={setShowDeleteAccount}>
        <AlertDialogContent className="bg-background border-foreground/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Conta do Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a conta de <strong>{profile?.full_name || profile?.phone}</strong>? 
              Todos os dados serão permanentemente removidos. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir Conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserDetailModal;
