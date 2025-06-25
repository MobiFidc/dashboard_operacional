import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Building2, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  RefreshCw,
  Eye,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_CONFIG, fetchWithTimeout, buildApiUrl } from '../../config/api';
import { formatCurrency, formatDate } from '../../utils/titulosUtils';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    hoje: { total: 0, valor: 0, com_nfe: 0, sem_nfe: 0 },
    ontem: { total: 0, valor: 0, com_nfe: 0, sem_nfe: 0 },
    semana: { total: 0, valor: 0, com_nfe: 0, sem_nfe: 0 },
    mes: { total: 0, valor: 0, com_nfe: 0, sem_nfe: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);

  // Função para buscar dados do dashboard
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      // Buscar dados de hoje
      const hojeUrl = buildApiUrl(API_CONFIG.ENDPOINTS.TITULOS, { data: today });
      const hojeResponse = await fetchWithTimeout(hojeUrl);
      
      if (!hojeResponse.ok) {
        throw new Error(`Erro HTTP ${hojeResponse.status}: ${hojeResponse.statusText}`);
      }
      
      const hojeData = await hojeResponse.json();
      
      // Buscar dados de ontem
      const ontemUrl = buildApiUrl(API_CONFIG.ENDPOINTS.TITULOS, { data: yesterday });
      const ontemResponse = await fetchWithTimeout(ontemUrl);
      
      if (!ontemResponse.ok) {
        throw new Error(`Erro HTTP ${ontemResponse.status}: ${ontemResponse.statusText}`);
      }
      
      const ontemData = await ontemResponse.json();
      
      // Processar dados
      const processData = (data) => {
        let titulos = [];
        
        // Verificar diferentes formatos de resposta
        if (Array.isArray(data)) {
          titulos = data;
        } else if (data && data.success && Array.isArray(data.data)) {
          titulos = data.data;
        } else if (data && Array.isArray(data.titulos)) {
          titulos = data.titulos;
        }
        
        const stats = {
          total: titulos.length,
          valor: titulos.reduce((sum, titulo) => sum + parseFloat(titulo.valor || 0), 0),
          com_nfe: titulos.filter(titulo => titulo.nfe_numero || titulo.nfe_chave).length,
          sem_nfe: 0
        };
        stats.sem_nfe = stats.total - stats.com_nfe;
        
        return stats;
      };
      
      const hoje = processData(hojeData);
      const ontem = processData(ontemData);
      
      // Para semana e mês, vamos usar dados simulados baseados em hoje
      // Em uma implementação real, você faria chamadas separadas para esses períodos
      const semana = {
        total: hoje.total * 5,
        valor: hoje.valor * 5.2,
        com_nfe: hoje.com_nfe * 5,
        sem_nfe: hoje.sem_nfe * 5
      };
      
      const mes = {
        total: hoje.total * 22,
        valor: hoje.valor * 23.5,
        com_nfe: hoje.com_nfe * 22,
        sem_nfe: hoje.sem_nfe * 22
      };
      
      setDashboardData({ hoje, ontem, semana, mes });
      setLastUpdate(new Date());
      
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      
      let errorMessage = 'Erro desconhecido';
      
      if (err.message.includes('Timeout')) {
        errorMessage = 'Timeout: A API demorou muito para responder.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = `Erro de conexão: Não foi possível conectar com a API em ${API_CONFIG.BASE_URL}`;
      } else if (err.message.includes('HTTP')) {
        errorMessage = `Erro do servidor: ${err.message}`;
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando o componente monta
  useEffect(() => {
    fetchDashboardData();
    
    // Atualizar dados a cada 5 minutos
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Calcular variações percentuais
  const getVariacao = (atual, anterior) => {
    if (anterior === 0) return atual > 0 ? 100 : 0;
    return ((atual - anterior) / anterior) * 100;
  };

  const variacaoHoje = {
    total: getVariacao(dashboardData.hoje.total, dashboardData.ontem.total),
    valor: getVariacao(dashboardData.hoje.valor, dashboardData.ontem.valor)
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard Operacional</h1>
          <p>Bem-vindo, {user?.fullName}! Aqui está o resumo das operações.</p>
          <small className="api-info">API: {API_CONFIG.BASE_URL}</small>
        </div>
        
        <div className="header-actions">
          {lastUpdate && (
            <span className="last-update">
              Última atualização: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <button 
            onClick={fetchDashboardData} 
            className="btn btn-secondary"
            disabled={loading}
          >
            <RefreshCw size={20} className={loading ? 'spinning' : ''} />
            Atualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={fetchDashboardData} className="btn btn-sm">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Resumo de Hoje */}
      <div className="period-section">
        <h2>📊 Resumo de Hoje - {formatDate(new Date().toISOString().split('T')[0])}</h2>
        
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-header">
              <div className="stat-icon">
                <FileText size={24} />
              </div>
              <div className="stat-trend">
                {variacaoHoje.total !== 0 && (
                  <span className={`trend ${variacaoHoje.total >= 0 ? 'positive' : 'negative'}`}>
                    <TrendingUp size={16} />
                    {Math.abs(variacaoHoje.total).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div className="stat-content">
              <h3>Total de Títulos</h3>
              <div className="stat-value">
                {loading ? '...' : dashboardData.hoje.total.toLocaleString()}
              </div>
              <p className="stat-description">
                Títulos processados hoje
              </p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-header">
              <div className="stat-icon">
                <Building2 size={24} />
              </div>
              <div className="stat-trend">
                {variacaoHoje.valor !== 0 && (
                  <span className={`trend ${variacaoHoje.valor >= 0 ? 'positive' : 'negative'}`}>
                    <TrendingUp size={16} />
                    {Math.abs(variacaoHoje.valor).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div className="stat-content">
              <h3>Valor Total</h3>
              <div className="stat-value">
                {loading ? '...' : formatCurrency(dashboardData.hoje.valor)}
              </div>
              <p className="stat-description">
                Volume financeiro do dia
              </p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-header">
              <div className="stat-icon">
                <FileText size={24} />
              </div>
            </div>
            <div className="stat-content">
              <h3>Com NFe</h3>
              <div className="stat-value">
                {loading ? '...' : dashboardData.hoje.com_nfe.toLocaleString()}
              </div>
              <p className="stat-description">
                Títulos com nota fiscal
              </p>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-header">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
            </div>
            <div className="stat-content">
              <h3>Sem NFe</h3>
              <div className="stat-value">
                {loading ? '...' : dashboardData.hoje.sem_nfe.toLocaleString()}
              </div>
              <p className="stat-description">
                Títulos sem nota fiscal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparativo de Períodos */}
      <div className="period-section">
        <h2>📈 Comparativo de Períodos</h2>
        
        <div className="comparison-grid">
          <div className="comparison-card">
            <div className="comparison-header">
              <Calendar size={20} />
              <h3>Ontem</h3>
            </div>
            <div className="comparison-stats">
              <div className="comparison-stat">
                <span className="label">Títulos:</span>
                <span className="value">{loading ? '...' : dashboardData.ontem.total.toLocaleString()}</span>
              </div>
              <div className="comparison-stat">
                <span className="label">Valor:</span>
                <span className="value">{loading ? '...' : formatCurrency(dashboardData.ontem.valor)}</span>
              </div>
            </div>
          </div>

          <div className="comparison-card">
            <div className="comparison-header">
              <Calendar size={20} />
              <h3>Esta Semana</h3>
            </div>
            <div className="comparison-stats">
              <div className="comparison-stat">
                <span className="label">Títulos:</span>
                <span className="value">{loading ? '...' : dashboardData.semana.total.toLocaleString()}</span>
              </div>
              <div className="comparison-stat">
                <span className="label">Valor:</span>
                <span className="value">{loading ? '...' : formatCurrency(dashboardData.semana.valor)}</span>
              </div>
            </div>
          </div>

          <div className="comparison-card">
            <div className="comparison-header">
              <Calendar size={20} />
              <h3>Este Mês</h3>
            </div>
            <div className="comparison-stats">
              <div className="comparison-stat">
                <span className="label">Títulos:</span>
                <span className="value">{loading ? '...' : dashboardData.mes.total.toLocaleString()}</span>
              </div>
              <div className="comparison-stat">
                <span className="label">Valor:</span>
                <span className="value">{loading ? '...' : formatCurrency(dashboardData.mes.valor)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="period-section">
        <h2>⚡ Ações Rápidas</h2>
        
        <div className="quick-actions">
          <a href="/conferencia-notas" className="action-card">
            <div className="action-icon">
              <Eye size={24} />
            </div>
            <div className="action-content">
              <h3>Conferir Notas</h3>
              <p>Acessar módulo de conferência</p>
            </div>
          </a>

          <a href="/conferencia-notas" className="action-card">
            <div className="action-icon">
              <Download size={24} />
            </div>
            <div className="action-content">
              <h3>Exportar Dados</h3>
              <p>Baixar relatórios em CSV</p>
            </div>
          </a>

          <div className="action-card" onClick={fetchDashboardData} style={{cursor: 'pointer'}}>
            <div className="action-icon">
              <RefreshCw size={24} />
            </div>
            <div className="action-content">
              <h3>Atualizar Dados</h3>
              <p>Recarregar informações</p>
            </div>
          </div>

          {user?.hasPermission && user.hasPermission('relatorios') && (
            <a href="/relatorios" className="action-card">
              <div className="action-icon">
                <FileText size={24} />
              </div>
              <div className="action-content">
                <h3>Relatórios</h3>
                <p>Visualizar relatórios detalhados</p>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;