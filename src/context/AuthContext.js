import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Tipos de usuário e suas permissões
export const USER_TYPES = {
  OPERADOR_1: 'OPERADOR_1',
  OPERADOR_2: 'OPERADOR_2', 
  OPERADOR_3: 'OPERADOR_3',
  OPERADOR_4: 'OPERADOR_4',
  SUPORTE_OPERACIONAL: 'SUPORTE_OPERACIONAL',
  SUPERVISOR: 'SUPERVISOR'
};

export const PERMISSIONS = {
  [USER_TYPES.OPERADOR_1]: ['conferencia_notas'],
  [USER_TYPES.OPERADOR_2]: ['conferencia_notas'],
  [USER_TYPES.OPERADOR_3]: ['conferencia_notas'],
  [USER_TYPES.OPERADOR_4]: ['conferencia_notas'],
  [USER_TYPES.SUPORTE_OPERACIONAL]: ['conferencia_notas', 'suporte'],
  [USER_TYPES.SUPERVISOR]: ['conferencia_notas', 'suporte', 'admin', 'relatorios']
};

// Usuários do sistema baseados na documentação
export const SYSTEM_USERS = {
  // Operadores
  'daiana': {
    password: '123',
    userType: USER_TYPES.OPERADOR_1,
    fullName: 'Daiana Silva'
  },
  'gabriel': {
    password: '123',
    userType: USER_TYPES.OPERADOR_2,
    fullName: 'Gabriel Santos'
  },
  'brunna': {
    password: '123',
    userType: USER_TYPES.OPERADOR_3,
    fullName: 'Brunna Costa'
  },
  'carol': {
    password: '123',
    userType: USER_TYPES.OPERADOR_4,
    fullName: 'Carol Oliveira'
  },
  // Suporte
  'jeann': {
    password: '123',
    userType: USER_TYPES.SUPORTE_OPERACIONAL,
    fullName: 'Jeann Suporte'
  },
  // Supervisor
  'admin': {
    password: 'master',
    userType: USER_TYPES.SUPERVISOR,
    fullName: 'Administrador'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('dashboard_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Normalizar username (case-insensitive)
    const normalizedUsername = username.toLowerCase().trim();
    
    // Verificar se o usuário existe
    const systemUser = SYSTEM_USERS[normalizedUsername];
    
    if (!systemUser) {
      throw new Error('Usuário não encontrado');
    }
    
    // Verificar senha (case-sensitive)
    if (systemUser.password !== password) {
      throw new Error('Senha incorreta');
    }
    
    // Criar dados do usuário logado
    const userData = {
      id: Date.now(),
      username: normalizedUsername,
      fullName: systemUser.fullName,
      userType: systemUser.userType,
      permissions: PERMISSIONS[systemUser.userType] || [],
      loginTime: new Date().toISOString()
    };
    
    setUser(userData);
    localStorage.setItem('dashboard_user', JSON.stringify(userData));
    
    console.log('✅ Login realizado:', {
      username: userData.username,
      fullName: userData.fullName,
      userType: userData.userType,
      permissions: userData.permissions
    });
    
    return true;
  };

  const logout = () => {
    console.log('👋 Logout realizado para:', user?.fullName);
    setUser(null);
    localStorage.removeItem('dashboard_user');
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const value = {
    user,
    login,
    logout,
    hasPermission,
    loading,
    isAuthenticated: !!user,
    systemUsers: SYSTEM_USERS // Para uso no componente de login
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};