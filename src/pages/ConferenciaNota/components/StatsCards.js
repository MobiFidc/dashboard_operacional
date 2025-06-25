import React from 'react';
import { FileText, Building2, TrendingUp, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../../utils/titulosUtils';

const StatsCards = ({ stats, selectedDate }) => {
  const formatSelectedDate = (dateString) => {
    if (!dateString) return 'Data não selecionada';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="stats-cards">
      <div className="stats-card blue">
        <div className="stats-card-header">
          <div className="stats-icon">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="stats-title">Total de Títulos</h3>
            <p className="stats-value">{stats.totalTitulos || 0}</p>
            <p className="stats-subtitle">
              {formatSelectedDate(selectedDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="stats-card green">
        <div className="stats-card-header">
          <div className="stats-icon">
            <DollarSign size={24} />
          </div>
          <div>
            <h3 className="stats-title">Valor Total</h3>
            <p className="stats-value">{formatCurrency(stats.valorTotal || 0)}</p>
            <p className="stats-subtitle">
              Soma de todos os títulos
            </p>
          </div>
        </div>
      </div>

      <div className="stats-card purple">
        <div className="stats-card-header">
          <div className="stats-icon">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="stats-title">Cedentes</h3>
            <p className="stats-value">{stats.totalCedentes || 0}</p>
            <p className="stats-subtitle">
              Empresas distintas
            </p>
          </div>
        </div>
      </div>

      <div className="stats-card orange">
        <div className="stats-card-header">
          <div className="stats-icon">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="stats-title">Valor Médio</h3>
            <p className="stats-value">{formatCurrency(stats.mediaValor || 0)}</p>
            <p className="stats-subtitle">
              Por título
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;