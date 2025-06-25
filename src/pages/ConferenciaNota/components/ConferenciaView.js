import React from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Calendar, 
  Building2, 
  FileText, 
  AlertCircle 
} from 'lucide-react';
import { formatCurrency, formatDate, TIPOS_PROPOSTA } from '../../../utils/titulosUtils';
import CedentesList from './CedentesList';
import TitulosDetalhes from './TitulosDetalhes';

const ConferenciaView = ({
  // Props de dados
  user,
  selectedDate,
  loading,
  error,
  stats,
  titulosAgrupadosPorCedente,
  filteredAndSortedTitulos,
  filters,
  mostrarDetalhes,
  cedenteAtivo,
  
  // Props de handlers
  onDateChange,
  onSearchChange,
  onFilterChange,
  onRefresh,
  onExport,
  onTestApi,
  onCedenteSelect,
  onBackToCedentes,
  
  // Props de configuração
  apiBaseUrl
}) => {
  return (
    <div className="conferencia-nota">
      <div className="page-header">
        <div className="header-content">
          <h2>Conferência de Notas</h2>
          <p>Conferência de títulos e notas fiscais - {user?.fullName}</p>
          <small className="api-info">API: {apiBaseUrl}</small>
        </div>
        
        <div className="header-actions">
          <button 
            onClick={onTestApi} 
            className="btn btn-outline"
            title="Testar conexão com API"
          >
            🔗 Testar API
          </button>
          
          <button 
            onClick={onRefresh} 
            className="btn btn-secondary"
            disabled={loading}
          >
            <RefreshCw size={20} className={loading ? 'spinning' : ''} />
            Atualizar
          </button>
          
          <button 
            onClick={onExport} 
            className="btn btn-primary"
            disabled={filteredAndSortedTitulos.length === 0}
          >
            <Download size={20} />
            Exportar
          </button>
        </div>
      </div>

      {/* Seletor de Data */}
      <div className="date-selector">
        <div className="date-input-group">
          <Calendar size={20} />
          <label htmlFor="date-select">Data para consulta:</label>
          <input
            id="date-select"
            type="date"
            value={selectedDate}
            onChange={onDateChange}
            disabled={loading}
          />
        </div>
      </div>

      {/* Estatísticas */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <h3>Cedentes</h3>
            <div className="stat-value">{Object.keys(titulosAgrupadosPorCedente).length}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon blue">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>Total de Títulos</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon green">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <h3>Valor Total</h3>
            <div className="stat-value">{formatCurrency(stats.valor_total)}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon orange">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>Com NFe</h3>
            <div className="stat-value">{stats.com_nfe}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon red">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Sem NFe</h3>
            <div className="stat-value">{stats.sem_nfe}</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por cedente, número, sacado ou CNPJ..."
            onChange={onSearchChange}
            disabled={loading}
          />
        </div>
        
        <div className="filter-group">
          <Filter size={20} />
          <select
            value={filters.tipo}
            onChange={(e) => onFilterChange('tipo', e.target.value)}
            disabled={loading}
          >
            <option value="todos">Todos os tipos</option>
            {Object.entries(TIPOS_PROPOSTA).map(([key, value]) => (
              <option key={`tipo_${key}`} value={key}>{value}</option>
            ))}
          </select>
        </div>

        {mostrarDetalhes && (
          <button 
            onClick={onBackToCedentes}
            className="btn btn-secondary"
          >
            ← Voltar para Cedentes
          </button>
        )}
      </div>

      {/* Conteúdo Principal */}
      <div className="content-section">
        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <div className="error-content">
              <strong>Erro de Conexão</strong>
              <p>{error}</p>
              <div className="error-actions">
                <button onClick={onRefresh} className="btn btn-sm">
                  <RefreshCw size={16} />
                  Tentar novamente
                </button>
                <button onClick={onTestApi} className="btn btn-sm btn-outline">
                  🔗 Testar API
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando títulos de {formatDate(selectedDate)}...</p>
            <small>Conectando com {apiBaseUrl}</small>
          </div>
        ) : mostrarDetalhes && cedenteAtivo ? (
          <TitulosDetalhes 
            cedente={cedenteAtivo}
            titulos={titulosAgrupadosPorCedente[cedenteAtivo]?.titulos || []}
            onBack={onBackToCedentes}
            filters={filters}
          />
        ) : Object.keys(titulosAgrupadosPorCedente).length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <h3>Nenhum título encontrado</h3>
            <p>
              {filteredAndSortedTitulos.length === 0 
                ? `Não há títulos para a data ${formatDate(selectedDate)}`
                : 'Nenhum título corresponde aos filtros aplicados'
              }
            </p>
            {filteredAndSortedTitulos.length === 0 && !error && (
              <button onClick={onRefresh} className="btn btn-primary">
                <RefreshCw size={20} />
                Recarregar
              </button>
            )}
          </div>
        ) : (
          <CedentesList 
            cedentes={titulosAgrupadosPorCedente}
            onCedenteSelect={onCedenteSelect}
            filters={filters}
          />
        )}
      </div>

      {/* Rodapé com informações */}
      {Object.keys(titulosAgrupadosPorCedente).length > 0 && !mostrarDetalhes && (
        <div className="table-footer">
          <div className="results-info">
            {Object.keys(titulosAgrupadosPorCedente).length} cedente(s) • {filteredAndSortedTitulos.length} título(s)
          </div>
          <div className="total-info">
            Total: {formatCurrency(stats.valor_total)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConferenciaView;