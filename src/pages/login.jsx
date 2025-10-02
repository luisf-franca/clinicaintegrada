import React, { useState } from 'react';
import '../styles/login.css';
import { useAuth } from '../contexts/AuthContext'; // Ajuste o caminho se necessário

const LoginPage = () => {
  // Consumindo o contexto de autenticação!
  const { login, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: 'atendente@user.com.br',
    senha: 'Teste1@',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.senha) {
      return; // A validação de required do HTML já cuida disso
    }
    // A única responsabilidade do componente é chamar a função de login do contexto
    await login(formData);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sistema de Atendimento</h1>
          <p>Faça login para acessar o sistema</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;