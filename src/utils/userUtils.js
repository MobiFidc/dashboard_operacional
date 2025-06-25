import { USER_TYPES } from '../context/AuthContext';

// Labels amigáveis para os tipos de usuário
export const USER_TYPE_LABELS = {
  [USER_TYPES.OPERADOR_1]: 'Operador 1',
  [USER_TYPES.OPERADOR_2]: 'Operador 2',
  [USER_TYPES.OPERADOR_3]: 'Operador 3',
  [USER_TYPES.OPERADOR_4]: 'Operador 4',
  [USER_TYPES.SUPORTE_OPERACIONAL]: 'Suporte Operacional',
  [USER_TYPES.SUPERVISOR]: 'Supervisor'
};

// Função para obter o label do tipo de usuário
export const getUserTypeLabel = (userType) => {
  return USER_TYPE_LABELS[userType] || 'Usuário';
};

// Função para obter a cor do badge do usuário
export const getUserTypeBadgeColor = (userType) => {
  const colors = {
    [USER_TYPES.OPERADOR_1]: 'blue',
    [USER_TYPES.OPERADOR_2]: 'blue',
    [USER_TYPES.OPERADOR_3]: 'blue',
    [USER_TYPES.OPERADOR_4]: 'blue',
    [USER_TYPES.SUPORTE_OPERACIONAL]: 'orange',
    [USER_TYPES.SUPERVISOR]: 'green'
  };
  
  return colors[userType] || 'gray';
};

// Função para obter as iniciais do nome do usuário
export const getUserInitials = (fullName) => {
  if (!fullName) return 'U';
  
  const names = fullName.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Função para formatar o nome de exibição
export const getDisplayName = (user) => {
  if (!user) return 'Usuário';
  
  if (user.fullName) {
    return user.fullName;
  }
  
  // Capitalizar o username se não tiver fullName
  return user.username.charAt(0).toUpperCase() + user.username.slice(1);
};