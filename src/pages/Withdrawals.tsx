import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpCircle } from 'lucide-react';
import { useTransactions } from '@/hooks/useUserData';

const Withdrawals: React.FC = () => {
  const navigate = useNavigate();
  const { data: transactions, isLoading } = useTransactions('withdrawal');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10';
      case 'rejected': return 'text-destructive bg-destructive/10';
      default: return 'text-warning bg-warning/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Pago';
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
        <h1 className="text-base font-semibold text-foreground">Registro de Saques</h1>
      </header>

      {/* Transactions List */}
      <div className="mx-3 mt-3 space-y-2">
        {!transactions || transactions.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <ArrowUpCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum saque registrado</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="glass-card p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ArrowUpCircle className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-foreground">Saque</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(tx.status)}`}>
                  {getStatusLabel(tx.status)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Valor:</span>
                <span className="text-foreground font-medium">
                  Kz {Number(tx.amount).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Data:</span>
                <span className="text-foreground">
                  {new Date(tx.created_at).toLocaleDateString('pt-AO')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Withdrawals;
