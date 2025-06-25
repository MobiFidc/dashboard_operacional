import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react';
import { useAuth, SYSTEM_USERS } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.username.trim()) {
        throw new Error('Por favor, digite o nome de usuário');
      }

      if (!formData.password) {
        throw new Error('Por favor, digite a senha');
      }

      await login(formData.username, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  const handleQuickLogin = (username) => {
    const systemUser = SYSTEM_USERS[username];
    if (systemUser) {
      setFormData({
        username: username,
        password: systemUser.password
      });
      setError('');
    }
  };

  // Agrupar usuários por tipo
  const userGroups = {
    operadores: Object.entries(SYSTEM_USERS).filter(([_, user]) => 
      user.userType.startsWith('OPERADOR_')
    ),
    suporte: Object.entries(SYSTEM_USERS).filter(([_, user]) => 
      user.userType === 'SUPORTE_OPERACIONAL'
    ),
    supervisor: Object.entries(SYSTEM_USERS).filter(([_, user]) => 
      user.userType === 'SUPERVISOR'
    )
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <User size={48} />
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
              <User size={20} className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Digite seu usuário"
                disabled={loading}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                disabled={loading}
                autoComplete="current-password"
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
            disabled={loading}
          >
            <LogIn size={20} />
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="quick-login">
          <h3>🚀 Login Rápido - Demonstração</h3>
          
          <div className="user-group">
            <h4>👨‍💼 Operadores</h4>
            <div className="quick-login-buttons">
              {userGroups.operadores.map(([username, user]) => (
                <button
                  key={username}
                  onClick={() => handleQuickLogin(username)}
                  className="quick-login-btn operador"
                  disabled={loading}
                >
                  {user.fullName}
                  <small>{username}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="user-group">
            <h4>🛠️ Suporte</h4>
            <div className="quick-login-buttons">
              {userGroups.suporte.map(([username, user]) => (
                <button
                  key={username}
                  onClick={() => handleQuickLogin(username)}
                  className="quick-login-btn suporte"
                  disabled={loading}
                >
                  {user.fullName}
                  <small>{username}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="user-group">
            <h4>👑 Supervisor</h4>
            <div className="quick-login-buttons">
              {userGroups.supervisor.map(([username, user]) => (
                <button
                  key={username}
                  onClick={() => handleQuickLogin(username)}
                  className="quick-login-btn supervisor"
                  disabled={loading}
                >
                  {user.fullName}
                  <small>{username}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="login-footer">
          <p>
            <strong>API:</strong> http://192.168.0.141:8102/titulos
          </p>
          <small>
            Sistema de Dashboard Operacional v1.0.0
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;