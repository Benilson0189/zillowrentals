import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowDownCircle } from 'lucide-react';
import { useTransactions } from '@/hooks/useUserData';

const Deposits: React.FC = () => {
  const navigate = useNavigate();
  const { data: transactions, isLoading } = useTransactions('deposit');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10';
      case 'rejected': return 'text-destructive bg-destructive/10';
      default: return 'text-warning bg-warning/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Concluído';
      case 'rejected': return 'Rejeitado';
      default: return 'Em processamento';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="glass-card mx-3 mt-3 p-3 flex items-center gap-2">
        <button onClick={() => navigate('/profile')} className="p-1.5 rounded-full hover:bg-foreground/10">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Registro de Depósitos</h1>
      </header>

      {/* Transactions List */}
      <div className="mx-3 mt-3 space-y-2">
        {!transactions || transactions.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <ArrowDownCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum depósito registrado</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="glass-card p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ArrowDownCircle className="w-4 h-4 text-success" />
                  <span className="text-sm font-semibold text-foreground tracking-tight">Depósito</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(tx.status)}`}>
                  {getStatusLabel(tx.status)}
                </span>
              </div>
              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-2.5 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-secondary/80 tracking-wide uppercase">Valor</span>
                  <span className="text-sm font-semibold text-foreground tracking-tight">
                    Kz {Number(tx.amount).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-secondary/80 tracking-wide uppercase">Data</span>
                  <span className="text-sm font-medium text-foreground tracking-tight">
                    {new Date(tx.created_at).toLocaleDateString('pt-AO')}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Deposits;
