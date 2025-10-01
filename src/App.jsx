import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css'; // Certifique-se que o App.css atualizado está sendo importado

// COMPONENTS
import Router from './router.jsx';
import Sidebar from './components/SideBar/SideBar.jsx';

// FUNCTIONS
import Login from './functions/Authenticate/Login.jsx';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // Sua lógica de autenticação permanece a mesma, está ótima!
  const handleLogin = async () => {
    try {
      const response = await Login({
        email: 'atendente@user.com.br',
        senha: 'Teste1@',
      });
      // console.log('Usuário autenticado com sucesso:', response);

      localStorage.setItem('token', response.token);
      localStorage.setItem('dataExpiracao', response.expiration);
    } catch (error) {
      console.error('Erro ao realizar login:', error);
    }
  };

  const handleAuthentication = async () => {
    const dataExpiracao = localStorage.getItem('dataExpiracao');

    if (dataExpiracao) {
      const expiracaoDate = new Date(dataExpiracao);
      const currentDate = new Date();

      if (expiracaoDate < currentDate) {
        // console.log('Token expirado, realizando novo login...');
        await handleLogin();
      } else {
        // console.log('Token ainda válido.');
      }
    } else {
      // console.log('Nenhum token encontrado, realizando login inicial...');
      await handleLogin();
    }
  };

  useEffect(() => {
    handleLogin();

    const intervalId = setInterval(() => {
      handleAuthentication();
    }, 3600000); // 1 hora

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    // Esta é a principal mudança: a classe agora define o layout flexível.
    // A Sidebar e o <main> são irmãos diretos, facilitando o posicionamento.
    <div className="app-layout">
      {!isLoginPage && <Sidebar />}
      <main className="content-area">
        <Router />
      </main>
    </div>
  );
}

export default App;
