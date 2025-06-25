import React, { useState } from 'react';
import { Building2, FileText, DollarSign, ChevronRight, Eye, AlertCircle, CheckCircle, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '../../../utils/titulosUtils';

const CedentesList = ({ cedentes, onCedenteSelect, filters }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'asc' });
  
  const cedentesList = Object.values(cedentes || {});
  
  // Filtrar cedentes se houver filtro de busca
  const filteredCedentes = cedentesList.filter(cedente => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        cedente.nome.toLowerCase().includes(searchTerm) ||
        (cedente.numeroProposta && cedente.numeroProposta.toString().includes(searchTerm))
      );
    }
    return true;
  });

  // Ordenar cedentes
  const sortedCedentes = [...filteredCedentes].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Tratamento especial para números
    if (sortConfig.key === 'numeroProposta' || sortConfig.key === 'totalTitulos' || sortConfig.key === 'valorTotal') {
      aValue = parseFloat(aValue || 0);
      bValue = parseFloat(bValue || 0);
    }

    // Tratamento para strings
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown size={14} className="sort-icon inactive" />;
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (sortedCedentes.length === 0) {
    return (
      <div className="cedentes-container">
        <div className="cedentes-header">
          <h3>Cedentes do Dia</h3>
          <span className="cedentes-count">0 cedentes</span>
        </div>
        <div className="empty-state">
          <Building2 size={48} />
          <h3>Nenhum cedente encontrado</h3>
          <p>
            {filters.search 
              ? 'Tente ajustar os filtros de busca'
              : 'Não há dados para a data selecionada'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="cedentes-container">
      <div className="cedentes-header">
        <div className="header-info">
          <Building2 size={24} />
          <div>
            <h3>Cedentes do Dia</h3>
            <p>{sortedCedentes.length} cedente{sortedCedentes.length !== 1 ? 's' : ''} encontrado{sortedCedentes.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="cedentes-table-container">
        <table className="cedentes-table">
          <thead>
            <tr>
              <th 
                onClick={() => handleSort('numeroProposta')} 
                className="sortable proposta-header"
              >
                <div className="header-content">
                  <span>Nº Proposta</span>
                  {getSortIcon('numeroProposta')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('nome')} 
                className="sortable cedente-header"
              >
                <div className="header-content">
                  <span>Cedente</span>
                  {getSortIcon('nome')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('totalTitulos')} 
                className="sortable"
              >
                <div className="header-content">
                  <span>Títulos</span>
                  {getSortIcon('totalTitulos')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('valorTotal')} 
                className="sortable"
              >
                <div className="header-content">
                  <span>Valor Total</span>
                  {getSortIcon('valorTotal')}
                </div>
              </th>
              <th>Com NFe</th>
              <th>Sem NFe</th>
              <th>% NFe</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedCedentes.map((cedente) => {
              const percentualNFe = cedente.totalTitulos > 0 
                ? ((cedente.comNFe / cedente.totalTitulos) * 100).toFixed(1)
                : 0;

              return (
                <tr 
                  key={`cedente_${cedente.nome}_${cedente.numeroProposta || 'sem_proposta'}`}
                  className="cedente-row"
                  onClick={() => onCedenteSelect(cedente.nome)}
                >
                  <td className="proposta-info">
                    <div className="proposta-display">
                      {cedente.numeroProposta ? (
                        <>
                          <div className="proposta-numero">
                            #{cedente.numeroProposta}
                          </div>
                          {cedente.dataOperacao && (
                            <div className="proposta-data">
                              {new Date(cedente.dataOperacao).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="proposta-sem-numero">
                          <span className="sem-proposta">Sem proposta</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="cedente-info">
                    <div className="cedente-main">
                      <div className="cedente-icon">
                        <Building2 size={20} />
                      </div>
                      <div className="cedente-details">
                        <div className="cedente-name">{cedente.nome}</div>
                        <div className="cedente-meta">
                          {cedente.qtdPropostos > 0 && (
                            <span className="meta-item">
                              Propostos: {cedente.qtdPropostos} • {formatCurrency(cedente.vlrPropostos)}
                            </span>
                          )}
                          {cedente.statusOperacao && (
                            <span className={`status-operacao ${cedente.statusOperacao.toLowerCase()}`}>
                              {cedente.statusOperacao}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="titulos-count">
                    <div className="count-badge">
                      <FileText size={16} />
                      <span>{cedente.totalTitulos}</span>
                    </div>
                  </td>
                  
                  <td className="valor-total">
                    <div className="valor-display">
                      <DollarSign size={16} />
                      <span className="valor-amount">{formatCurrency(cedente.valorTotal)}</span>
                    </div>
                  </td>
                  
                  <td className="nfe-com">
                    <div className="nfe-badge success">
                      <CheckCircle size={16} />
                      <span>{cedente.comNFe}</span>
                    </div>
                  </td>
                  
                  <td className="nfe-sem">
                    <div className="nfe-badge warning">
                      <AlertCircle size={16} />
                      <span>{cedente.semNFe}</span>
                    </div>
                  </td>
                  
                  <td className="nfe-percentual">
                    <div className={`percentual-badge ${percentualNFe >= 80 ? 'high' : percentualNFe >= 50 ? 'medium' : 'low'}`}>
                      {percentualNFe}%
                    </div>
                  </td>
                  
                  <td className="acoes">
                    <button 
                      className="action-btn view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCedenteSelect(cedente.nome);
                      }}
                      title="Ver títulos"
                    >
                      <Eye size={16} />
                      <span>Ver Títulos</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="cedentes-summary">
        <div className="summary-item">
          <span className="summary-label">Total de Cedentes:</span>
          <span className="summary-value">{sortedCedentes.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total de Títulos:</span>
          <span className="summary-value">
            {sortedCedentes.reduce((sum, c) => sum + c.totalTitulos, 0)}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Valor Total:</span>
          <span className="summary-value">
            {formatCurrency(sortedCedentes.reduce((sum, c) => sum + c.valorTotal, 0))}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Ordenado por:</span>
          <span className="summary-value">
            {sortConfig.key === 'numeroProposta' ? 'Nº Proposta' : 
             sortConfig.key === 'nome' ? 'Nome' :
             sortConfig.key === 'totalTitulos' ? 'Títulos' :
             sortConfig.key === 'valorTotal' ? 'Valor' : 'Nome'} 
            ({sortConfig.direction === 'asc' ? 'Crescente' : 'Decrescente'})
          </span>
        </div>
      </div>
    </div>
  );
};

export default CedentesList;