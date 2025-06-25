import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Download, RefreshCw, Calendar, Building2, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_CONFIG, fetchWithTimeout, buildApiUrl } from '../../config/api';
import { 
  formatCurrency, 
  formatDate, 
  formatCNPJ, 
  TIPOS_PROPOSTA,
  filterTitulos,
  sortTitulos,
  getTitulosStats,
  exportToCSV,
  debounce
} from '../../utils/titulosUtils';
import './ConferenciaNota.css';

const ConferenciaNota = () => {
  const { user } = useAuth();
  const [titulos, setTitulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    search: '',
    tipo: 'todos',
    dataInicio: '',
    dataFim: ''
  });
  
  // Estados para navegação
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [cedenteAtivo, setCedenteAtivo] = useState(null);
  
  // Estados para ordenação
  const [sortBy, setSortBy] = useState('numero');
  const [sortOrder, setSortOrder] = useState('asc');

  // Função para buscar títulos da API
  const fetchTitulos = async (date) => {
    setLoading(true);
    setError('');
    
    try {
      console.log(`Buscando títulos para a data: ${date}`);
      
      // Construir URL da API
      const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.TITULOS, { data: date });
      console.log(`URL da API: ${apiUrl}`);
      
      // Fazer requisição com timeout
      const response = await fetchWithTimeout(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Resposta da API:', data);
      
      // Verificar se a resposta tem o formato esperado
      if (data && Array.isArray(data)) {
        // Se a resposta é um array direto
        setTitulos(data);
        console.log(`✅ Carregados ${data.length} títulos para ${date}`);
      } else if (data && data.success && Array.isArray(data.data)) {
        // Se a resposta tem formato { success: true, data: [...] }
        setTitulos(data.data);
        console.log(`✅ Carregados ${data.data.length} títulos para ${date}`);
      } else if (data && Array.isArray(data.titulos)) {
        // Se a resposta tem formato { titulos: [...] }
        setTitulos(data.titulos);
        console.log(`✅ Carregados ${data.titulos.length} títulos para ${date}`);
      } else {
        console.warn('⚠️ Formato de resposta não reconhecido:', data);
        setTitulos([]);
      }
      
    } catch (err) {
      console.error('❌ Erro ao buscar títulos:', err);
      
      let errorMessage = 'Erro desconhecido';
      
      if (err.message.includes('Timeout')) {
        errorMessage = 'Timeout: A API demorou muito para responder. Verifique sua conexão.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = `Erro de conexão: Não foi possível conectar com a API em ${API_CONFIG.BASE_URL}`;
      } else if (err.message.includes('HTTP')) {
        errorMessage = `Erro do servidor: ${err.message}`;
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setTitulos([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando o componente monta ou a data muda
  useEffect(() => {
    fetchTitulos(selectedDate);
  }, [selectedDate]);

  // Função debounced para busca
  const debouncedSearch = useMemo(
    () => debounce((searchTerm) => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 300),
    []
  );

  // Aplicar filtros e ordenação
  const filteredAndSortedTitulos = useMemo(() => {
    let result = filterTitulos(titulos, filters);
    result = sortTitulos(result, sortBy, sortOrder);
    return result;
  }, [titulos, filters, sortBy, sortOrder]);

  // Agrupar títulos por cedente com informações de proposta
  const titulosAgrupadosPorCedente = useMemo(() => {
    const grupos = {};
    
    filteredAndSortedTitulos.forEach(titulo => {
      const nomeCedente = titulo.cedente_nome || 'Cedente não informado';
      
      if (!grupos[nomeCedente]) {
        grupos[nomeCedente] = {
          nome: nomeCedente,
          numeroProposta: titulo.numero_proposta || titulo.proposta_numero || null,
          dataOperacao: titulo.data_operacao || titulo.data_proposta || null,
          statusOperacao: titulo.status_operacao || titulo.status_proposta || 'Ativo',
          totalTitulos: 0,
          valorTotal: 0,
          comNFe: 0,
          semNFe: 0,
          qtdPropostos: titulo.qtd_propostos || 0,
          vlrPropostos: parseFloat(titulo.vlr_propostos || 0),
          titulos: []
        };
      }
      
      grupos[nomeCedente].totalTitulos++;
      grupos[nomeCedente].valorTotal += parseFloat(titulo.valor || 0);
      grupos[nomeCedente].titulos.push(titulo);
      
      // Verificar se tem NFe
      if (titulo.nfe_numero || titulo.nfe_chave || titulo.numero_nfe) {
        grupos[nomeCedente].comNFe++;
      } else {
        grupos[nomeCedente].semNFe++;
      }
    });
    
    return grupos;
  }, [filteredAndSortedTitulos]);

  // Calcular estatísticas
  const stats = useMemo(() => getTitulosStats(filteredAndSortedTitulos), [filteredAndSortedTitulos]);

  // Handlers
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setMostrarDetalhes(false);
    setCedenteAtivo(null);
  };

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleRefresh = () => {
    fetchTitulos(selectedDate);
  };

  const handleExport = () => {
    if (filteredAndSortedTitulos.length === 0) {
      alert('Nenhum dado para exportar');
      return;
    }
    
    const exportData = filteredAndSortedTitulos.map(titulo => ({
      'Nº Proposta': titulo.numero_proposta || titulo.proposta_numero || '',
      'Cedente': titulo.cedente_nome || '',
      'Número': titulo.numero || '',
      'Tipo': TIPOS_PROPOSTA[titulo.tipo_proposta] || 'N/A',
      'Sacado': titulo.sacado_nome || titulo.sacado_razao_social || '',
      'CNPJ': titulo.cnpj || '',
      'Valor': titulo.valor || 0,
      'Vencimento': titulo.data_vencimento || '',
      'NFe': titulo.nfe_numero || titulo.numero_nfe || 'Não informado',
      'Status': titulo.status_operacao || titulo.status_proposta || ''
    }));
    
    const filename = `titulos_${selectedDate}_${new Date().getTime()}.csv`;
    exportToCSV(exportData, filename);
  };

  const handleCedenteSelect = (nomeCedente) => {
    setCedenteAtivo(nomeCedente);
    setMostrarDetalhes(true);
  };

  const handleBackToCedentes = () => {
    setMostrarDetalhes(false);
    setCedenteAtivo(null);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  // Função para testar conexão com a API
  const testApiConnection = async () => {
    try {
      const testUrl = buildApiUrl('/health', {}) || API_CONFIG.BASE_URL;
      const response = await fetchWithTimeout(testUrl);
      console.log('✅ Conexão com API OK');
      alert('✅ Conexão com API funcionando!');
      return true;
    } catch (err) {
      console.log('❌ Falha na conexão com API:', err.message);
      alert(`❌ Falha na conexão: ${err.message}`);
      return false;
    }
  };

  return (
    <div className="conferencia-nota">
      <div className="page-header">
        <div className="header-content">
          <h2>Conferência de Notas</h2>
          <p>Conferência de títulos e notas fiscais - {user?.fullName}</p>
          <small className="api-info">API: {API_CONFIG.BASE_URL}</small>
        </div>
        
        <div className="header-actions">
          <button 
            onClick={testApiConnection} 
            className="btn btn-outline"
            title="Testar conexão com API"
          >
            🔗 Testar API
          </button>
          
          <button 
            onClick={handleRefresh} 
            className="btn btn-secondary"
            disabled={loading}
          >
            <RefreshCw size={20} className={loading ? 'spinning' : ''} />
            Atualizar
          </button>
          
          <button 
            onClick={handleExport} 
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
            onChange={handleDateChange}
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
            placeholder="Buscar por cedente, número, sacado, CNPJ ou nº proposta..."
            onChange={handleSearchChange}
            disabled={loading}
          />
        </div>
        
        <div className="filter-group">
          <Filter size={20} />
          <select
            value={filters.tipo}
            onChange={(e) => handleFilterChange('tipo', e.target.value)}
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
            onClick={handleBackToCedentes}
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
                <button onClick={handleRefresh} className="btn btn-sm">
                  <RefreshCw size={16} />
                  Tentar novamente
                </button>
                <button onClick={testApiConnection} className="btn btn-sm btn-outline">
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
            <small>Conectando com {API_CONFIG.BASE_URL}</small>
          </div>
        ) : mostrarDetalhes && cedenteAtivo ? (
          // Mostrar detalhes dos títulos do cedente selecionado
          <div className="titulos-detalhes">
            <div className="detalhes-header">
              <button onClick={handleBackToCedentes} className="back-button">
                ← Voltar para Cedentes
              </button>
              <div className="cedente-info">
                <Building2 size={24} />
                <div>
                  <h2>{cedenteAtivo}</h2>
                  <p>{titulosAgrupadosPorCedente[cedenteAtivo]?.totalTitulos} título{titulosAgrupadosPorCedente[cedenteAtivo]?.totalTitulos !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="titulos-table">
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
                    <th>CNPJ</th>
                    <th onClick={() => handleSort('valor')} className="sortable">
                      Valor {getSortIcon('valor')}
                    </th>
                    <th onClick={() => handleSort('data_vencimento')} className="sortable">
                      Vencimento {getSortIcon('data_vencimento')}
                    </th>
                    <th>NFe</th>
                  </tr>
                </thead>
                <tbody>
                  {titulosAgrupadosPorCedente[cedenteAtivo]?.titulos.map((titulo, index) => (
                    <tr key={titulo.id || index}>
                      <td className="numero-cell">
                        {titulo.numero || 'N/A'}
                      </td>
                      <td>
                        <span className={`tipo-badge tipo-${titulo.tipo_proposta || 0}`}>
                          {TIPOS_PROPOSTA[titulo.tipo_proposta] || 'N/A'}
                        </span>
                      </td>
                      <td className="sacado-cell" title={titulo.sacado_nome || titulo.sacado_razao_social}>
                        {titulo.sacado_nome || titulo.sacado_razao_social || 'N/A'}
                      </td>
                      <td className="cnpj-cell">
                        {formatCNPJ(titulo.cnpj)}
                      </td>
                      <td className="valor-cell">
                        {formatCurrency(titulo.valor)}
                      </td>
                      <td className="data-cell">
                        {formatDate(titulo.data_vencimento)}
                      </td>
                      <td className="nfe-cell">
                        {titulo.nfe_numero || titulo.numero_nfe ? (
                          <span className="nfe-badge nfe-ok">
                            📄 {titulo.nfe_numero || titulo.numero_nfe}
                          </span>
                        ) : (
                          <span className="nfe-badge nfe-missing">
                            ❌ Sem NFe
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : Object.keys(titulosAgrupadosPorCedente).length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <h3>Nenhum título encontrado</h3>
            <p>
              {titulos.length === 0 
                ? `Não há títulos para a data ${formatDate(selectedDate)}`
                : 'Nenhum título corresponde aos filtros aplicados'
              }
            </p>
            {titulos.length === 0 && !error && (
              <button onClick={handleRefresh} className="btn btn-primary">
                <RefreshCw size={20} />
                Recarregar
              </button>
            )}
          </div>
        ) : (
          // Mostrar lista de cedentes
          <div className="cedentes-container">
            <div className="cedentes-header">
              <div className="header-info">
                <Building2 size={24} />
                <div>
                  <h3>Cedentes do Dia</h3>
                  <p>{Object.keys(titulosAgrupadosPorCedente).length} cedente{Object.keys(titulosAgrupadosPorCedente).length !== 1 ? 's' : ''} encontrado{Object.keys(titulosAgrupadosPorCedente).length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            <div className="cedentes-table-container">
              <table className="cedentes-table">
                <thead>
                  <tr>
                    <th className="proposta-header">
                      <div className="header-content">
                        <span>Nº Proposta</span>
                      </div>
                    </th>
                    <th className="cedente-header">
                      <div className="header-content">
                        <span>Cedente</span>
                      </div>
                    </th>
                    <th>
                      <div className="header-content">
                        <span>Títulos</span>
                      </div>
                    </th>
                    <th>
                      <div className="header-content">
                        <span>Valor Total</span>
                      </div>
                    </th>
                    <th>Com NFe</th>
                    <th>Sem NFe</th>
                    <th>% NFe</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(titulosAgrupadosPorCedente).map((cedente) => {
                    const percentualNFe = cedente.totalTitulos > 0 
                      ? ((cedente.comNFe / cedente.totalTitulos) * 100).toFixed(1)
                      : 0;

                    return (
                      <tr 
                        key={`cedente_${cedente.nome}_${cedente.numeroProposta || 'sem_proposta'}`}
                        className="cedente-row"
                        onClick={() => handleCedenteSelect(cedente.nome)}
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
                            <span className="valor-amount">{formatCurrency(cedente.valorTotal)}</span>
                          </div>
                        </td>
                        
                        <td className="nfe-com">
                          <div className="nfe-badge success">
                            <span>{cedente.comNFe}</span>
                          </div>
                        </td>
                        
                        <td className="nfe-sem">
                          <div className="nfe-badge warning">
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
                              handleCedenteSelect(cedente.nome);
                            }}
                            title="Ver títulos"
                          >
                            Ver Títulos
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
                <span className="summary-value">{Object.keys(titulosAgrupadosPorCedente).length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total de Títulos:</span>
                <span className="summary-value">
                  {Object.values(titulosAgrupadosPorCedente).reduce((sum, c) => sum + c.totalTitulos, 0)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Valor Total:</span>
                <span className="summary-value">
                  {formatCurrency(Object.values(titulosAgrupadosPorCedente).reduce((sum, c) => sum + c.valorTotal, 0))}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé com informações */}
      {filteredAndSortedTitulos.length > 0 && !mostrarDetalhes && (
        <div className="table-footer">
          <div className="results-info">
            Mostrando {filteredAndSortedTitulos.length} de {titulos.length} títulos
          </div>
          <div className="total-info">
            Total: {formatCurrency(stats.valor_total)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConferenciaNota;