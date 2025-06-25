import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Clock, Copy } from 'lucide-react';
import { API_CONFIG, fetchWithTimeout, buildApiUrl } from '../../config/api';
import './ApiTester.css';

const ApiTester = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testDate, setTestDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const runTest = async () => {
    setLoading(true);
    setTestResult(null);

    const startTime = Date.now();
    
    try {
      console.log('🧪 Iniciando teste da API...');
      
      // Construir URL de teste
      const testUrl = buildApiUrl(API_CONFIG.ENDPOINTS.TITULOS, { data: testDate });
      
      console.log(`📡 URL de teste: ${testUrl}`);
      
      // Fazer requisição
      const response = await fetchWithTimeout(testUrl);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (response.ok) {
        const data = await response.json();
        
        // Analisar resposta
        let dataCount = 0;
        let dataFormat = 'Desconhecido';
        
        if (Array.isArray(data)) {
          dataCount = data.length;
          dataFormat = 'Array direto';
        } else if (data && data.success && Array.isArray(data.data)) {
          dataCount = data.data.length;
          dataFormat = 'Objeto com success e data';
        } else if (data && Array.isArray(data.titulos)) {
          dataCount = data.titulos.length;
          dataFormat = 'Objeto com titulos';
        }
        
        setTestResult({
          success: true,
          status: response.status,
          statusText: response.statusText,
          responseTime,
          dataCount,
          dataFormat,
          url: testUrl,
          sampleData: JSON.stringify(data, null, 2).substring(0, 500) + '...'
        });
        
        console.log('✅ Teste concluído com sucesso:', {
          status: response.status,
          responseTime: `${responseTime}ms`,
          dataCount,
          dataFormat
        });
        
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.error('❌ Teste falhou:', error);
      
      setTestResult({
        success: false,
        error: error.message,
        responseTime,
        url: buildApiUrl(API_CONFIG.ENDPOINTS.TITULOS, { data: testDate })
      });
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.TITULOS, { data: testDate });
    navigator.clipboard.writeText(url);
  };

  const currentUrl = buildApiUrl(API_CONFIG.ENDPOINTS.TITULOS, { data: testDate });

  return (
    <div className="api-tester">
      <div className="test-controls">
        <div className="date-input">
          <label htmlFor="test-date">Data para teste:</label>
          <input
            type="date"
            id="test-date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="url-display">
          <div className="url-code">{currentUrl}</div>
          <button 
            onClick={copyUrl}
            className="copy-btn"
            title="Copiar URL"
            disabled={loading}
          >
            <Copy size={16} />
          </button>
        </div>

        <button
          onClick={runTest}
          disabled={loading}
          className="test-btn"
        >
          {loading ? (
            <>
              <Clock size={20} className="icon loading" />
              Testando...
            </>
          ) : (
            <>
              <Play size={20} className="icon" />
              Testar Conectividade
            </>
          )}
        </button>
      </div>

      {testResult && (
        <div className="test-results">
          <div className="result-header">
            <h4>Resultado do Teste</h4>
            <span className={`status-badge ${testResult.success ? 'success' : 'error'}`}>
              {testResult.success ? 'SUCESSO' : 'ERRO'}
            </span>
          </div>

          <div className="result-details">
            {testResult.success ? (
              <>
                <div className="detail-item">
                  <strong>✅ Status HTTP:</strong>
                  <span>{testResult.status} - {testResult.statusText}</span>
                </div>
                
                <div className="detail-item">
                  <strong>⏱️ Tempo de Resposta:</strong>
                  <span>{testResult.responseTime}ms</span>
                </div>
                
                <div className="detail-item">
                  <strong>📊 Registros Encontrados:</strong>
                  <span>{testResult.dataCount} registros</span>
                </div>
                
                <div className="detail-item">
                  <strong>📋 Formato dos Dados:</strong>
                  <span>{testResult.dataFormat}</span>
                </div>
                
                <div className="detail-item">
                  <strong>🔗 URL Testada:</strong>
                  <div className="url-code">{testResult.url}</div>
                </div>
                
                <div className="detail-item">
                  <strong>📄 Amostra dos Dados:</strong>
                  <pre className="sample-data">{testResult.sampleData}</pre>
                </div>
              </>
            ) : (
              <>
                <div className="detail-item error">
                  <strong>❌ Erro:</strong>
                  <span>{testResult.error}</span>
                </div>
                
                <div className="detail-item">
                  <strong>⏱️ Tempo até Falha:</strong>
                  <span>{testResult.responseTime}ms</span>
                </div>
                
                <div className="detail-item">
                  <strong>🔗 URL Testada:</strong>
                  <div className="url-code">{testResult.url}</div>
                </div>
                
                <div className="detail-item">
                  <strong>💡 Possíveis Soluções:</strong>
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                    <li>Verificar se o servidor está rodando</li>
                    <li>Confirmar se a URL está correta</li>
                    <li>Verificar conectividade de rede</li>
                    <li>Verificar se há dados para a data selecionada</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTester;