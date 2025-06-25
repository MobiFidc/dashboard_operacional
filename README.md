# Dashboard Operacional

Dashboard em React para gerenciamento de operações com sistema de autenticação baseado em níveis de acesso.

## 🚀 Funcionalidades

- **Sistema de Login** com 6 níveis de acesso:
  - Operador 1-4
  - Suporte Operacional  
  - Supervisor (acesso total)

- **Módulos Implementados**:
  - Dashboard principal com estatísticas
  - Conferência de Notas (primeira aplicação)
  - Estrutura preparada para módulos futuros

- **APIs Preparadas** (endpoints futuros):
  - `http://192.168.0.141:8000/bordero?data=YYYY-MM-DD`
  - `http://192.168.0.141:8102/titulos?data=YYYY-MM-DD`
  - `http://192.168.0.141:8101/sgm_cedente_gerente_usuario`
  - `http://192.168.0.141:8100/propostas_com_fluxo`

## 🎨 Customização de Cores

Para alterar as cores do sistema, edite o arquivo `src/styles/colors.js`:

```javascript
// Cores principais - altere aqui para mudar o tema
export const colors = {
  primary: {
    500: '#3b82f6', // Cor principal (azul)
    // ... outras variações
  }
}
```

### Onde as cores são aplicadas:

- **Sidebar**: `theme.sidebar` em `colors.js`
- **Header**: `theme.header` em `colors.js`  
- **Cards**: `theme.card` em `colors.js`
- **Botões**: `theme.button` em `colors.js`

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Login/           # Sistema de login
│   ├── Layout/          # Layout principal (Sidebar, Header)
│   └── Dashboard/       # Dashboard inicial
├── modules/             # Módulos funcionais separados
│   └── ConferenciaNota/ # Módulo de conferência de notas
├── context/             # Contextos React (Auth)
├── styles/              # Estilos globais e cores
└── App.js              # Componente principal
```

## 🔐 Níveis de Acesso

| Usuário | Permissões |
|---------|------------|
| Operador 1-4 | Conferência de Notas |
| Suporte Operacional | Conferência + Suporte |
| Supervisor | Acesso Total |

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm start

# Build para produção
npm run build
```

## 📦 Dependências

- React 18+
- React Router DOM
- Lucide React (ícones)

## 🔄 Próximos Passos

1. Implementar integração com APIs
2. Adicionar novos módulos conforme necessário
3. Implementar autenticação real
4. Adicionar testes unitários

## 💡 Como Adicionar Novos Módulos

1. **Criar pasta do módulo** em `src/modules/NomeModulo/`
2. **Adicionar ao menu** em `src/components/Layout/Sidebar.js`
3. **Configurar permissões** em `src/context/AuthContext.js`
4. **Importar no layout** em `src/components/Layout/MainLayout.js`

### Exemplo de novo módulo:

```javascript
// src/modules/NovoModulo/NovoModulo.js
import React from 'react';
import './NovoModulo.css';

const NovoModulo = () => {
  return (
    <div className="novo-modulo">
      <h2>Novo Módulo</h2>
      {/* Conteúdo do módulo */}
    </div>
  );
};

export default NovoModulo;
```

## 🎯 Testes de Login

Para testar o sistema, use qualquer usuário/senha com os tipos:
- OPERADOR_1, OPERADOR_2, OPERADOR_3, OPERADOR_4
- SUPORTE_OPERACIONAL  
- SUPERVISOR

## 📱 Responsividade

O dashboard é totalmente responsivo e se adapta a diferentes tamanhos de tela.

## 🔧 Configurações Adicionais

### Alterar porta de desenvolvimento:
```bash
PORT=3001 npm start
```

### Variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto para configurações específicas.
```

Agora vamos criar um arquivo de configuração para facilitar futuras integrações com APIs:

```javascript:src/config/api.js
// Configurações das APIs
export const API_CONFIG = {
  // URLs base das APIs
  BORDERO_API: 'http://192.168.0.141:8000',
  TITULOS_API: 'http://192.168.0.141:8102', 
  USUARIOS_API: 'http://192.168.0.141:8101',
  PROPOSTAS_API: 'http://192.168.0.141:8100',
  
  // Endpoints específicos
  ENDPOINTS: {
    BORDERO: '/bordero',
    TITULOS: '/titulos', 
    USUARIOS: '/sgm_cedente_gerente_usuario',
    PROPOSTAS: '/propostas_com_fluxo'
  },
  
  // Configurações de requisição
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Timeout padrão (em ms)
  TIMEOUT: 10000
};

// Função helper para construir URLs com parâmetros de data
export const buildApiUrl = (baseUrl, endpoint, params = {}) => {
  const url = new URL(endpoint, baseUrl);
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  return url.toString();
};

// Função helper para formatar datas no padrão esperado pelas APIs
export const formatDateForApi = (date) => {
  if (!date) return null;
  
  if (typeof date === 'string') {
    return date;
  }
  
  if (date instanceof Date) {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }
  
  return null;
};

// Exemplos de uso das URLs (para referência futura)
export const API_EXAMPLES = {
  // Borderos de uma data específica
  getBorderos: (date) => buildApiUrl(
    API_CONFIG.BORDERO_API, 
    API_CONFIG.ENDPOINTS.BORDERO, 
    { data: formatDateForApi(date) }
  ),
  
  // Títulos de uma data específica  
  getTitulos: (date) => buildApiUrl(
    API_CONFIG.TITULOS_API,
    API_CONFIG.ENDPOINTS.TITULOS,
    { data: formatDateForApi(date) }
  ),
  
  // Usuários, cedentes e gerentes
  getUsuarios: () => buildApiUrl(
    API_CONFIG.USUARIOS_API,
    API_CONFIG.ENDPOINTS.USUARIOS
  ),
  
  // Propostas com fluxo
  getPropostas: (date) => buildApiUrl(
    API_CONFIG.PROPOSTAS_API,
    API_CONFIG.ENDPOINTS.PROPOSTAS,
    { data: formatDateForApi(date) }
  )
};
```

E vamos criar um serviço base para futuras integrações:

```javascript:src/services/apiService.js
import { API_CONFIG, buildApiUrl, formatDateForApi } from '../config/api';

class ApiService {
  constructor() {
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Método base para fazer requisições
  async makeRequest(url, options = {}) {
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      timeout: this.timeout,
      ...options
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API Request Error:', error);
      return { 
        success: false, 
        error: error.message || 'Erro na requisição' 
      };
    }
  }

  // Métodos específicos para cada API (para implementação futura)
  
  async getBorderos(date) {
    const url = buildApiUrl(
      API_CONFIG.BORDERO_API,
      API_CONFIG.ENDPOINTS.BORDERO,
      { data: formatDateForApi(date) }
    );
    return this.makeRequest(url);
  }

  async getTitulos(date) {
    const url = buildApiUrl(
      API_CONFIG.TITULOS_API,
      API_CONFIG.ENDPOINTS.TITULOS,
      { data: formatDateForApi(date) }
    );
    return this.makeRequest(url);
  }

  async getUsuarios() {
    const url = buildApiUrl(
      API_CONFIG.USUARIOS_API,
      API_CONFIG.ENDPOINTS.USUARIOS
    );
    return this.makeRequest(url);
  }

  async getPropostas(date) {
    const url = buildApiUrl(
      API_CONFIG.PROPOSTAS_API,
      API_CONFIG.ENDPOINTS.PROPOSTAS,
      { data: formatDateForApi(date) }
    );
    return this.makeRequest(url);
  }
}

// Instância singleton do serviço
export const apiService = new ApiService();
export default apiService;
```

Finalmente, vamos criar um hook personalizado para gerenciar estados de loading e erro:

```javascript:src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    setData,
    setError
  };
};

// Hook para executar automaticamente na montagem
export const useApiEffect = (apiFunction, dependencies = []) => {
  const apiState = useApi(apiFunction, dependencies);

  useEffect(() => {
    apiState.execute();
  }, dependencies);

  return apiState;
};
```

Para finalizar, vamos executar os comandos para inicializar o projeto:

```bash
npm start