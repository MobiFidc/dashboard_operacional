import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { testApiConnection } from '../../config/api';
import './ApiStatus.css';

const ApiStatus = () => {
  const [status, setStatus] = useState({
    isOnline: null,
    message: 'Verificando...',
    lastCheck: null
  });

  const checkApiStatus = async () => {
    try {
      const result = await testApiConnection();
      setStatus({
        isOnline: result.success,
        message: result.message,
        lastCheck: new Date()
      });
    } catch (error) {
      setStatus({
        isOnline: false,
        message: 'Erro ao verificar API',
        lastCheck: new Date()
      });
    }
  };

  useEffect(() => {
    // Verificar status inicial
    checkApiStatus();
    
    // Verificar a cada 30 segundos
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (status.isOnline === null) {
      return <AlertCircle size={16} className="status-icon checking" />;
    }
    return status.isOnline ? 
      <Wifi size={16} className="status-icon online" /> : 
      <WifiOff size={16} className="status-icon offline" />;
  };

  const getStatusClass = () => {
    if (status.isOnline === null) return 'checking';
    return status.isOnline ? 'online' : 'offline';
  };

  return (
    <div className={`api-status ${getStatusClass()}`} title={status.message}>
      {getStatusIcon()}
      <div className="status-info">
        <div className="status-text">
          {status.isOnline === null ? 'Verificando API...' : 
           status.isOnline ? 'API Online' : 'API Offline'}
        </div>
        {status.lastCheck && (
          <div className="status-time">
            {status.lastCheck.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiStatus;