// Tipos de proposta
export const TIPOS_PROPOSTA = {
  1: 'Duplicata',
  2: 'Nota Promissória',
  3: 'Cheque',
  4: 'Outros',
  0: 'Não Definido'
};

export const STATUS_NFE = {
  0: 'Sem NFe',
  1: 'Com NFe',
  2: 'NFe Pendente'
};

// Formatação de moeda
export const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue);
};

// Formatação de data
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    return '-';
  }
};

// Formatação de CNPJ
export const formatCNPJ = (cnpj) => {
  if (!cnpj) return '-';
  
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) return cnpj;
  
  return cleanCNPJ.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
};

// Agrupar títulos por cedente
export const groupTitulosByCedente = (titulos) => {
  if (!titulos || !Array.isArray(titulos)) return [];
  
  const grouped = titulos.reduce((acc, titulo) => {
    const cedenteId = titulo.cedente_id || 'sem_cedente';
    const cedenteName = titulo.cedente_nome || 'Cedente não identificado';
    
    if (!acc[cedenteId]) {
      acc[cedenteId] = {
        id: cedenteId,
        nome: cedenteName,
        titulos: [],
        stats: {
          total: 0,
          valor_total: 0,
          com_nfe: 0,
          sem_nfe: 0
        }
      };
    }
    
    acc[cedenteId].titulos.push(titulo);
    acc[cedenteId].stats.total += 1;
    acc[cedenteId].stats.valor_total += parseFloat(titulo.valor || 0);
    
    if (hasNFe(titulo)) {
      acc[cedenteId].stats.com_nfe += 1;
    } else {
      acc[cedenteId].stats.sem_nfe += 1;
    }
    
    return acc;
  }, {});
  
  return Object.values(grouped);
};

// Obter estatísticas dos títulos
export const getTitulosStats = (titulos) => {
  if (!titulos || !Array.isArray(titulos)) {
    return {
      total: 0,
      valor_total: 0,
      com_nfe: 0,
      sem_nfe: 0,
      por_tipo: {}
    };
  }
  
  const stats = {
    total: titulos.length,
    valor_total: 0,
    com_nfe: 0,
    sem_nfe: 0,
    por_tipo: {}
  };
  
  titulos.forEach(titulo => {
    // Valor total
    stats.valor_total += parseFloat(titulo.valor || 0);
    
    // NFe
    if (hasNFe(titulo)) {
      stats.com_nfe += 1;
    } else {
      stats.sem_nfe += 1;
    }
    
    // Por tipo
    const tipo = titulo.tipo_proposta || 0;
    if (!stats.por_tipo[tipo]) {
      stats.por_tipo[tipo] = 0;
    }
    stats.por_tipo[tipo] += 1;
  });
  
  return stats;
};

// Filtrar títulos
export const filterTitulos = (titulos, filters) => {
  if (!titulos || !Array.isArray(titulos)) return [];
  
  return titulos.filter(titulo => {
    // Filtro por busca
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        titulo.numero?.toLowerCase().includes(searchTerm) ||
        titulo.sacado_nome?.toLowerCase().includes(searchTerm) ||
        titulo.sacado_razao_social?.toLowerCase().includes(searchTerm) ||
        titulo.cnpj?.includes(searchTerm);
      
      if (!matchesSearch) return false;
    }
    
    // Filtro por tipo
    if (filters.tipo !== undefined && filters.tipo !== '' && filters.tipo !== 'todos') {
      if (titulo.tipo_proposta !== parseInt(filters.tipo)) return false;
    }
    
    // Filtro por data
    if (filters.dataInicio) {
      const tituloDate = new Date(titulo.data_vencimento);
      const filterDate = new Date(filters.dataInicio);
      if (tituloDate < filterDate) return false;
    }
    
    if (filters.dataFim) {
      const tituloDate = new Date(titulo.data_vencimento);
      const filterDate = new Date(filters.dataFim);
      if (tituloDate > filterDate) return false;
    }
    
    return true;
  });
};

// Verificar se título tem NFe
export const hasNFe = (titulo) => {
  return !!(titulo.nfe_chave || titulo.nfe_numero || titulo.STATUS_NF === 1);
};

// Obter classe CSS para badge do tipo
export const getTipoBadgeClass = (tipo) => {
  const classes = {
    0: 'tipo-0', // Duplicata
    1: 'tipo-1', // Nota Fiscal
    2: 'tipo-2', // Cheque
    3: 'tipo-3'  // Outros
  };
  
  return `tipo-badge ${classes[tipo] || 'tipo-0'}`;
};

// Truncar texto
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '-';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

// Ordenar títulos
export const sortTitulos = (titulos, sortBy, sortOrder = 'asc') => {
  if (!titulos || !Array.isArray(titulos)) return [];
  
  return [...titulos].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];
    
    // Tratamento especial para valores numéricos
    if (sortBy === 'valor') {
      valueA = parseFloat(valueA || 0);
      valueB = parseFloat(valueB || 0);
    }
    
    // Tratamento especial para datas
    if (sortBy === 'data_vencimento' || sortBy === 'data_emissao') {
      valueA = new Date(valueA || 0);
      valueB = new Date(valueB || 0);
    }
    
    // Tratamento para strings
    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
    }
    if (typeof valueB === 'string') {
      valueB = valueB.toLowerCase();
    }
    
    if (valueA < valueB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Validar CNPJ
export const isValidCNPJ = (cnpj) => {
  if (!cnpj) return false;
  
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
  
  // Validação dos dígitos verificadores
  let soma = 0;
  let peso = 2;
  
  for (let i = 11; i >= 0; i--) {
    soma += parseInt(cleanCNPJ.charAt(i)) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  
  const resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;
  
  if (parseInt(cleanCNPJ.charAt(12)) !== digito1) return false;
  
  soma = 0;
  peso = 2;
  
  for (let i = 12; i >= 0; i--) {
    soma += parseInt(cleanCNPJ.charAt(i)) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  
  const resto2 = soma % 11;
  const digito2 = resto2 < 2 ? 0 : 11 - resto2;
  
  return parseInt(cleanCNPJ.charAt(13)) === digito2;
};

// Formatar número de telefone
export const formatPhone = (phone) => {
  if (!phone) return '-';
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }
  
  return phone;
};

// Calcular dias até vencimento
export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Obter status do vencimento
export const getDueStatus = (dueDate) => {
  const days = getDaysUntilDue(dueDate);
  
  if (days === null) return 'unknown';
  if (days < 0) return 'overdue';
  if (days === 0) return 'due-today';
  if (days <= 7) return 'due-soon';
  
  return 'ok';
};

// Exportar dados para CSV
export const exportToCSV = (data, filename = 'titulos.csv') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('Nenhum dado para exportar');
    return;
  }
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escapar aspas e adicionar aspas se necessário
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Debounce para otimizar buscas
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Obter data de hoje para API
export const getTodayForApi = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};