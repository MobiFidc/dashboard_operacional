// Arquivo central para gerenciar todas as cores do sistema
// Para mudar o tema, altere apenas os valores neste arquivo

export const colors = {
  // Cores primárias
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Cor principal
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Cores secundárias
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Cores de status
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
  
  // Cores neutras
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
};

// Tema do dashboard
export const theme = {
  // Layout principal
  sidebar: {
    background: colors.secondary[900],
    text: colors.white,
    textSecondary: colors.secondary[300],
    hover: colors.secondary[800],
    active: colors.primary[600],
  },
  
  // Header
  header: {
    background: colors.white,
    text: colors.secondary[900],
    border: colors.secondary[200],
  },
  
  // Cards e containers
  card: {
    background: colors.white,
    border: colors.secondary[200],
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  
  // Botões
  button: {
    primary: {
      background: colors.primary[600],
      hover: colors.primary[700],
      text: colors.white,
    },
    secondary: {
      background: colors.secondary[100],
      hover: colors.secondary[200],
      text: colors.secondary[900],
    }
  }
};