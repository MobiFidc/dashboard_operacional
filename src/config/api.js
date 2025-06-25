// Configuração da API
export const API_CONFIG = {
  BASE_URL: 'http://192.168.0.141:8102',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  ENDPOINTS: {
    TITULOS: '/titulos',
    HEALTH: '/titulos' // Usando o mesmo endpoint para teste de conectividade
  }
};

// Função helper para fazer requisições com timeout
export const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
  
  try {
    console.log(`🌐 Fazendo requisição para: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      }
    });
    
    clearTimeout(timeoutId);
    
    console.log(`✅ Resposta recebida: ${response.status} ${response.statusText}`);
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error('⏰ Timeout na requisição');
      throw new Error('Timeout: A requisição demorou muito para responder');
    }
    
    console.error('❌ Erro na requisição:', error);
    throw error;
  }
};

// Função para construir URLs da API
export const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(API_CONFIG.BASE_URL + endpoint);
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });
  
  return url.toString();
};

// Função para testar conectividade com a API
export const testApiConnection = async () => {
  try {
    // Usar uma data específica para teste
    const testDate = new Date().toISOString().split('T')[0];
    const testUrl = buildApiUrl(API_CONFIG.ENDPOINTS.TITULOS, { data: testDate });
    
    console.log(`🔍 Testando conectividade: ${testUrl}`);
    
    const response = await fetchWithTimeout(testUrl);
    
    if (response.ok) {
      console.log('✅ API está respondendo normalmente');
      return { success: true, message: 'API conectada com sucesso' };
    } else {
      console.warn(`⚠️ API respondeu com status ${response.status}`);
      return { success: false, message: `API retornou status ${response.status}` };
    }
  } catch (error) {
    console.error('❌ Falha ao conectar com a API:', error.message);
    return { success: false, message: error.message };
  }
};

// Função para fazer requisições GET com tratamento de erro
export const apiGet = async (endpoint, params = {}) => {
  try {
    const url = buildApiUrl(endpoint, params);
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`Erro na requisição GET ${endpoint}:`, error);
    return { success: false, error: error.message };
  }
};

// Log da configuração atual
console.log('🔧 Configuração da API:', {
  baseUrl: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  endpoints: API_CONFIG.ENDPOINTS,
  fullTitulosUrl: API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TITULOS
});