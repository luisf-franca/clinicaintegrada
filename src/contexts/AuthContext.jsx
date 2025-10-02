import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Exporte esta instância para ser usada em toda a aplicação
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  }, [navigate]);

  // Efeito que roda uma vez na inicialização
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/usuarios/informacao')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          // Se o token for inválido, o interceptor abaixo cuidará do logout
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // CONFIGURAÇÃO DO INTERCEPTOR GLOBAL
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      // 1. Função para respostas de sucesso (não faz nada, apenas repassa)
      (response) => response,
      
      // 2. Função para respostas de erro
      (error) => {
        // Verifica se o erro é 401 (Não Autorizado)
        if (error.response?.status === 401) {
          console.log('Sessão expirada ou token inválido. Deslogando...');
          logout();
        }
        // Rejeita a promise para que o erro possa ser tratado localmente se necessário
        return Promise.reject(error);
      }
    );

    // Função de limpeza para remover o interceptor quando o componente desmontar
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);


  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userResponse = await api.get('/usuarios/informacao');
      setUser(userResponse.data);
      navigate('/');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      const errorMessage = err.response?.data?.message || "Email ou senha inválidos.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      isLoading,
      error,
      login,
      logout,
    }),
    [user, isLoading, error, login, logout] // Adicionei login e logout aqui
  );

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};