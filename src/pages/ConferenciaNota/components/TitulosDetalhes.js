import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  Eye, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Download,
  Filter,
  Search,
  Calendar,
  DollarSign,
  AlertTriangle,
  Info
} from 'lucide-react';
import { 
  formatCurrency, 
  formatDate, 
  formatCNPJ, 
  truncateText, 
  getTipoBadgeClass,
  TIPOS_PROPOSTA,
  hasNFe,
  filterTitulos
} from '../../../utils/titulosUtils';

const TitulosDetalhes = ({ cedente, titulos, onBack, filters }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'valor', direction: 'desc' });
  const [localFilters, setLocalFilters] = useState({
    search: '',
    tipo: 'todos',
    nfe: 'todos'
  });

  // Combinar filtros globais com locais
  const combinedFilters = {
    ...filters,
    ...localFilters
  };

  // Filtrar títulos baseado nos filtros combinados
  const filteredTitulos = useMemo(() => {
    let filtered = filterTitulos(titulos, combinedFilters);
    
    // Filtro adicional por NFe
    if (localFilters.nfe !== 'todos') {
      filtered = filtered.filter(titulo => {
        const temNFe = hasNFe(titulo);
        return localFilters.nfe === 'com' ? temNFe : !temNFe;
      });
    }
    
    return filtered;
  }, [titulos, combinedFilters, localFilters.nfe]);

  // Ordenar títulos
  const sortedTitulos = useMemo(() => {
    if (!sortConfig.key) return filteredTitulos;

    return [...filteredTitulos].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Tratamento especial para valores numéricos
      if (sortConfig.key === 'valor') {
        aValue = parseFloat(aValue || 0);
        bValue = parseFloat(bValue || 0);
      }

      // Tratamento especial para datas
      if (sortConfig.key.includes('data')) {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredTitulos, sortConfig]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const total = sortedTitulos.length;
    const valorTotal = sortedTitulos.reduce((sum, t) => sum + parseFloat(t.valor || 0), 0);
    const comNFe = sortedTitulos.filter(t => hasNFe(t)).length;
    const semNFe = total - comNFe;
    
    return {
      total,
      valorTotal,
      comNFe,
      semNFe,
      percentualNFe: total > 0 ? ((comNFe / total) * 100).toFixed(1) : 0
    };
  }, [sortedTitulos]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return '↕️';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handleLocalFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const exportTitulos = () => {
    // Implementar exportação específica dos títulos do cedente
    console.log('Exportar títulos do cedente:', cedente);
  };

  return (
    <div className="titulos-detalhes">
      {/* Header com informações do cedente */}
      <div className="detalhes-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
          <span>Voltar aos Cedentes</span>
        </button>
        
        <div className="cedente-header-info">
          <div className="cedente-main-info">
            <div className="cedente-icon-large">
              <Building2 size={32} />
            </div>
            <div className="cedente-details-header">
              <h2 className="cedente-name">{cedente}</h2>
              <p className="cedente-subtitle">
                {stats.total} título{stats.total !== 1 ? 's' : ''} • {formatCurrency(stats.valorTotal)}
              </p>
            </div>
          </div>
          
          <div className="header-actions">
            <button onClick={exportTitulos} className="action-btn export-btn">
              <Download size={16} />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas do cedente */}
      <div className="cedente-stats-cards">
        <div className="stat-card-small primary">
          <div className="stat-icon-small">
            <FileText size={20} />
          </div>
          <div className="stat-content-small">
            <div className="stat-value-small">{stats.total}</div>
            <div className="stat-label-small">Títulos</div>
          </div>
        </div>
        
        <div className="stat-card-small success">
          <div className="stat-icon-small">
            <DollarSign size={20} />
          </div>
          <div className="stat-content-small">
            <div className="stat-value-small">{formatCurrency(stats.valorTotal)}</div>
            <div className="stat-label-small">Valor Total</div>
          </div>
        </div>
        
        <div className="stat-card-small info">
          <div className="stat-icon-small">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content-small">
            <div className="stat-value-small">{stats.comNFe}</div>
            <div className="stat-label-small">Com NFe</div>
          </div>
        </div>
        
        <div className="stat-card-small warning">
          <div className="stat-icon-small">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-content-small">
            <div className="stat-value-small">{stats.semNFe}</div>
            <div className="stat-label-small">Sem NFe</div>
          </div>
        </div>
        
        <div className="stat-card-small neutral">
          <div className="stat-icon-small">
            <Info size={20} />
          </div>
          <div className="stat-content-small">
            <div className="stat-value-small">{stats.percentualNFe}%</div>
            <div className="stat-label-small">% NFe</div>
          </div>
        </div>
      </div>

      {/* Filtros específicos dos títulos */}
      <div className="titulos-filters">
        <div className="filters-row">
          <div className="search-filter">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar por número, sacado ou CNPJ..."
              value={localFilters.search}
              onChange={(e) => handleLocalFilterChange('search', e.target.value)}
            />
          </div>
          
          <div className="select-filter">
            <Filter size={16} />
            <select
              value={localFilters.tipo}
              onChange={(e) => handleLocalFilterChange('tipo', e.target.value)}
            >
              <option value="todos">Todos os tipos</option>
              {Object.entries(TIPOS_PROPOSTA).map(([key, value]) => (
                <option key={`tipo_filter_${key}`} value={key}>{value}</option>
              ))}
            </select>
          </div>
          
          <div className="select-filter">
            <FileText size={16} />
            <select
              value={localFilters.nfe}
              onChange={(e) => handleLocalFilterChange('nfe', e.target.value)}
            >
              <option value="todos">Todas as NFe</option>
              <option value="com">Com NFe</option>
              <option value="sem">Sem NFe</option>
            </select>
          </div>
        </div>
        
        <div className="results-info">
          Mostrando {sortedTitulos.length} de {titulos.length} títulos
        </div>
      </div>

      {/* Tabela de títulos */}
      {sortedTitulos.length === 0 ? (
        <div className="empty-state-detalhes">
          <FileText size={48} />
          <h3>Nenhum título encontrado</h3>
          <p>Tente ajustar os filtros de busca</p>
        </div>
      ) : (
        <div className="titulos-table-container">
          <table className="titulos-table-detalhes">
            <thead>
              <tr>
                <th onClick={() => handleSort('numero')} className="sortable">
                  Número {getSortIcon('numero')}
                </th>
                <th onClick={() => handleSort('tipo_proposta')} className="sortable">
                  Tipo {getSortIcon('tipo_proposta')}
                </th>
                <th onClick={() => handleSort('sacado_nome')} className="sortable">
                  Sacado {getSortIcon('sacado_nome')}
                </th>
                <th onClick={() => handleSort('cnpj')} className="sortable">
                  CNPJ {getSortIcon('cnpj')}
                </th>
                <th onClick={() => handleSort('valor')} className="sortable">
                  Valor {getSortIcon('valor')}
                </th>
                <th onClick={() => handleSort('data_vencimento')} className="sortable">
                  Vencimento {getSortIcon('data_vencimento')}
                </th>
                <th>NFe</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedTitulos.map((titulo) => (
                <tr key={titulo.id} className="titulo-row-detalhes">
                  <td className="numero-titulo">
                    <div className="numero-display">
                      <span className="numero-principal">{titulo.numero || '-'}</span>
                      {titulo.numero_sequencial && (
                        <span className="numero-sequencial">#{titulo.numero_sequencial}</span>
                      )}
                    </div>
                  </td>
                  
                  <td>
                    <span className={`tipo-badge ${getTipoBadgeClass(titulo.tipo_proposta)}`}>
                      {TIPOS_PROPOSTA[titulo.tipo_proposta] || 'N/A'}
                    </span>
                  </td>
                  
                  <td className="sacado-info-detalhes">
                    <div className="sacado-main">
                      <div className="sacado-nome">
                        {truncateText(titulo.sacado_nome || titulo.sacado_razao_social || 'N/A', 25)}
                      </div>
                      {titulo.sacado_apelido && titulo.sacado_apelido !== titulo.sacado_nome && (
                        <div className="sacado-apelido">
                          {truncateText(titulo.sacado_apelido, 20)}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="cnpj-detalhes">
                    {formatCNPJ(titulo.cnpj)}
                  </td>
                  
                  <td className="valor-detalhes">
                    <div className="valor-display">
                      {formatCurrency(titulo.valor)}
                    </div>
                  </td>
                  
                  <td className="data-vencimento-detalhes">
                    <div className="data-display">
                      <Calendar size={14} />
                      <span>{formatDate(titulo.data_vencimento)}</span>
                    </div>
                  </td>
                  
                  <td className="nfe-status-detalhes">
                    {hasNFe(titulo) ? (
                      <div className="nfe-badge-detalhes has-nfe">
                        <CheckCircle size={16} />
                        <span>NFe</span>
                        {titulo.nfe_numero && (
                          <div className="nfe-numero">{titulo.nfe_numero}</div>
                        )}
                      </div>
                    ) : (
                      <div className="nfe-badge-detalhes no-nfe">
                        <XCircle size={16} />
                        <span>Sem NFe</span>
                      </div>
                    )}
                  </td>
                  
                  <td className="acoes-detalhes">
                    <button className="action-button-small view" title="Ver detalhes completos">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer com resumo */}
      <div className="detalhes-footer">
        <div className="footer-summary">
          <div className="summary-item-detalhes">
            <span className="summary-label-detalhes">Títulos:</span>
            <span className="summary-value-detalhes">{stats.total}</span>
          </div>
          <div className="summary-item-detalhes">
            <span className="summary-label-detalhes">Valor Total:</span>
            <span className="summary-value-detalhes">{formatCurrency(stats.valorTotal)}</span>
          </div>
          <div className="summary-item-detalhes">
            <span className="summary-label-detalhes">Com NFe:</span>
            <span className="summary-value-detalhes success">{stats.comNFe} ({stats.percentualNFe}%)</span>
          </div>
          <div className="summary-item-detalhes">
            <span className="summary-label-detalhes">Sem NFe:</span>
            <span className="summary-value-detalhes warning">{stats.semNFe}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitulosDetalhes;