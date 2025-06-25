// Simulação de API - substitua pela API real
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Dados mockados para demonstração
const MOCK_TITULOS = [
  {
    id: 1,
    numero_titulo: 'DUP001',
    tipo_proposta: 0,
    cedente_nome: 'Empresa ABC Ltda',
    sacado_nome: 'Cliente XYZ',
    sacado_razao_social: 'Cliente XYZ Comércio Ltda',
    sacado_cnpj: '12345678000199',
    valor: 15000.50,
    data_vencimento: '2024-01-15',
    nfe_chave: '35200114200166000187550010000000015',
    status: 'pendente'
  },
  {
    id: 2,
    numero_titulo: 'NF002',
    tipo_proposta: 1,
    cedente_nome: 'Empresa ABC Ltda',
    sacado_nome: 'Cliente ABC',
    sacado_razao_social: 'Cliente ABC Indústria S.A.',
    sacado_cnpj: '98765432000188',
    valor: 25000.00,
    data_vencimento: '2024-01-20',
    nfe_chave: '',
    status: 'aprovado'
  },
  {
    id: 3,
    numero_titulo: 'DUP003',
    tipo_proposta: 0,
    cedente_nome: 'Fornecedor DEF S.A.',
    sacado_nome: 'Comprador 123',
    sacado_razao_social: 'Comprador 123 Ltda',
    sacado_cnpj: '11223344000155',
    valor: 8500.75,
    data_vencimento: '2024-01-25',
    nfe_chave: '35200114200166000187550010000000025',
    status: 'pendente'
  }
];

// Função para simular delay de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // Buscar títulos por data
  getTitulos: async (date) => {
    try {
      await delay(1000); // Simular delay da API
      
      // Em produção, fazer a chamada real:
      // const response = await fetch(`${API_BASE_URL}/titulos?date=${date}`);
      // if (!response.ok) throw new Error('Erro ao buscar títulos');
      // return await response.json();
      
      // Por enquanto, retornar dados mockados
      return MOCK_TITULOS;
    } catch (error) {
      console.error('Erro ao buscar títulos:', error);
      throw error;
    }
  },

  // Buscar detalhes de um título específico
  getTituloById: async (id) => {
    try {
      await delay(500);
      
      // const response = await fetch(`${API_BASE_URL}/titulos/${id}`);
      // if (!response.ok) throw new Error('Erro ao buscar título');
      // return await response.json();
      
      const titulo = MOCK_TITULOS.find(t => t.id === parseInt(id));
      if (!titulo) throw new Error('Título não encontrado');
      return titulo;
    } catch (error) {
      console.error('Erro ao buscar título:', error);
      throw error;
    }
  },

  // Atualizar status de um título
  updateTituloStatus: async (id, status) => {
    try {
      await delay(500);
      
      // const response = await fetch(`${API_BASE_URL}/titulos/${id}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status })
      // });
      // if (!response.ok) throw new Error('Erro ao atualizar status');
      // return await response.json();
      
      console.log(`Status do título ${id} atualizado para: ${status}`);
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }
};