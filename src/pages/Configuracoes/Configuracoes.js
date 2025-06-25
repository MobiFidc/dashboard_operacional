import React from 'react';
import { Settings, Database, Wifi } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ApiTester from '../../components/ApiTester/ApiTester';
import { API_CONFIG } from '../../config/api';
import './Configuracoes.css';

const Configuracoes = () => {
  const { user } = useAuth();

  return (
    <div className="configuracoes">
      <div className="page-header">
        <div className="header-content">
          <h2>⚙️ Configurações do Sistema</h2>
          <p>Configurações e testes de conectividade</p>
        </div>
      </div>

      <div className="config-sections">
        {/* Informações do Sistema */}
        <div className="config-section">
          <div className="section-header">
            <Settings size={24} />
            <h3>Informações do Sistema</h3>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <strong>Usuário Logado:</strong>
              <span>{user?.fullName}</span>
            </div>
            <div className="info-item">
              <strong>Tipo de Usuário:</strong>
              <span>{user?.userType?.replace('_', ' ')}</span>
            </div>
            <div className="info-item">
              <strong>Permissões:</strong>
              <span>{user?.permissions?.join(', ') || 'Nenhuma'}</span>
            </div>
            <div className="info-item">
              <strong>Versão do Sistema:</strong>
              <span>1.0.0</span>
            </div>
          </div>
        </div>

        {/* Configurações da API */}
        <div className="config-section">
          <div className="section-header">
            <Database size={24} />
            <h3>Configurações da API</h3>
          </div>
          
          <div className="api-config">
            <div className="config-item">
              <strong>URL Base:</strong>
              <code>{API_CONFIG.BASE_URL}</code>
            </div>
            <div className="config-item">
              <strong>Endpoint de Títulos:</strong>
              <code>{API_CONFIG.ENDPOINTS.TITULOS}</code>
            </div>
            <div className="config-item">
              <strong>URL Completa:</strong>
              <code>{API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TITULOS}</code>
            </div>
            <div className="config-item">
              <strong>Timeout:</strong>
              <span>{API_CONFIG.TIMEOUT}ms</span>
            </div>
          </div>
        </div>

        {/* Teste de Conectividade */}
        <div className="config-section">
          <div className="section-header">
            <Wifi size={24} />
            <h3>Teste de Conectividade</h3>
          </div>
          
          <ApiTester />
        </div>

        {/* Informações de Debug */}
        <div className="config-section">
          <div className="section-header">
            <Settings size={24} />
            <h3>Informações de Debug</h3>
          </div>
          
          <div className="debug-info">
            <div className="debug-item">
              <strong>User Agent:</strong>
              <code>{navigator.userAgent}</code>
            </div>
            <div className="debug-item">
              <strong>URL Atual:</strong>
              <code>{window.location.href}</code>
            </div>
            <div className="debug-item">
              <strong>Timestamp:</strong>
              <span>{new Date().toISOString()}</span>
            </div>
            <div className="debug-item">
              <strong>Timezone:</strong>
              <span>{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;