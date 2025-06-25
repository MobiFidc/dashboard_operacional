import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated, systemUsers } = useAuth();

  // Se já estiver autenticado, redirecionar para dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (user) => {
    setUsername(user);
    setPassword(systemUsers[user].password);
  };

  const demoUsers = [
    { key: 'daiana', name: 'Daiana Silva', type: 'Operador 1' },
    { key: 'gabriel', name: 'Gabriel Santos', type: 'Operador 2' },
    { key: 'brunna', name: 'Brunna Costa', type: 'Operador 3' },
    { key: 'carol', name: 'Carol Oliveira', type: 'Operador 4' },
    { key: 'jeann', name: 'Jeann Suporte', type: 'Suporte' },
    { key: 'admin', name: 'Administrador', type: 'Supervisor' }
  ];

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <LogIn size={48} />
          </div>
          <h1>Dashboard Operacional</h1>
          <p>Faça login para acessar o sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading || !username || !password}
          >
            {loading ? (
              <>
                <div className="spinner-small"></div>
                Entrando...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Entrar
              </>
            )}
          </button>
        </form>

        <div className="demo-section">
          <h3>🚀 Login Rápido - Demonstração</h3>
          <p>Clique em um usuário para preencher automaticamente:</p>
          
          <div className="demo-users">
            {demoUsers.map((user) => (
              <button
                key={user.key}
                type="button"
                className="demo-user-btn"
                onClick={() => handleQuickLogin(user.key)}
                disabled={loading}
              >
                <div className="demo-user-info">
                  <span className="demo-user-name">{user.name}</span>
                  <span className="demo-user-type">{user.type}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="login-footer">
          <p>© 2024 Dashboard Operacional. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;