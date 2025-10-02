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

  return (
    <div className="app-layout">
      {!isLoginPage && <Sidebar />}
      <main className="content-area">
        <Router />
      </main>
    </div>
  );
}

export default App;
