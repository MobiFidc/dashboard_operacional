import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ConferenciaNota from './pages/ConferenciaNota/ConferenciaNota';
import Configuracoes from './pages/Configuracoes/Configuracoes';
import './App.css';

function App() {
  console.log('🚀 App renderizado');
  
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Rota pública de login */}
              <Route path="/login" element={<Login />} />
              
              {/* Rotas protegidas com layout */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                {/* Dashboard - acessível para todos os usuários logados */}
                <Route index element={<Dashboard />} />
                
                {/* Conferência de Notas - requer permissão específica */}
                <Route 
                  path="conferencia-notas" 
                  element={
                    <ProtectedRoute permission="conferencia_notas">
                      <ConferenciaNota />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Configurações - acessível para todos os usuários logados */}
                <Route path="configuracoes" element={<Configuracoes />} />
              </Route>
              
              {/* Redirecionar rotas não encontradas para o dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;