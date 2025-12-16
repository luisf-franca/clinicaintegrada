import React, { useState, useEffect, useCallback } from 'react';
import '../styles/home.css';

// COMPONENTS
import ListaEsperaResumo from '../components/Resumo/ListaEspera/ListaEsperaResumo';
import AgendamentosResumo from '../components/Resumo/Agendamentos/AgendamentosResumo';

// import ConsultaResumo from '../components/Resumo/Consultas/ConsultaResumo';
import SalasResumo from '../components/Resumo/Salas/SalasResumo';
import PacientesResumo from '../components/Resumo/Pacientes/PacientesResumo';
import RelatorioResumo from '../components/Resumo/Relatorios/RelatorioResumo';

// FUNCTIONS
import GetPacientes from '../functions/Pacientes/GetPacientes';
import { decodeToken } from '../services/authUtils';

const Home = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [pacientes, setPacientes] = useState([]);
  const [pacienteEtapa, setPacienteEtapa] = useState(null);
  const [pacienteSelecionadoId, setPacienteSelecionadoId] = useState(null);
  const [userName, setUserName] = useState('Usuário');

  // 2. Envolva a função com useCallback
  const handlePesquisarPacientes = useCallback(async (filtroNome) => {
    try {
      const options = { page: 1, pageSize: 10 };
      if (filtroNome && filtroNome.trim()) {
        options.filter = `nome^${filtroNome}`;
      }
      const response = await GetPacientes(options);
      setPacientes(response?.items || []);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      setPacientes([]);
    }
  }, []);

  // Carregar dados iniciais e nome do usuário
  useEffect(() => {
    handlePesquisarPacientes('');

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.usuario_nome) {
        setUserName(decoded.usuario_nome);
      }
    }
  }, [handlePesquisarPacientes]);

  // Auto-refresh a cada 3 minutos
  const [refreshKey, setRefreshKey] = useState(0); // Estado para forçar reload dos componentes filhos

  // Relógio
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Relógio que atualiza a cada segundo
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Auto-refresh dos dados a cada 3 minutos
    const refreshInterval = setInterval(() => {
      // 1. Recarregar lista de pacientes do componente pai
      handlePesquisarPacientes('');

      // 2. Atualizar chave para forçar remount/reload dos widgets filhos
      setRefreshKey(prev => prev + 1);
    }, 180000); // 3 minutos

    return () => {
      clearInterval(clockInterval);
      clearInterval(refreshInterval);
    };
  }, [handlePesquisarPacientes]);

  const formattedTime = currentTime.toLocaleString('pt-BR', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter

  return (
    <div className="home container">
      <div className="home-header">
        <nav className="home-tabs">
          <button
            className={activeTab === 'inicio' ? 'active' : ''}
            onClick={() => setActiveTab('inicio')}
          >
            Início
          </button>
          <button
            className={activeTab === 'visao-geral' ? 'active' : ''}
            onClick={() => setActiveTab('visao-geral')}
          >
            Visão Geral
          </button>
        </nav>

        {/* Relógio no canto superior direito */}
        <div className="header-clock" style={{
          color: 'var(--cinza-600)',
          fontWeight: 500,
          fontSize: '0.95rem',
          textTransform: 'capitalize'
        }}>
          {formattedTime}
        </div>
      </div>
      <div className="home-body home-dashboard">

        {activeTab === 'inicio' && (
          <>
            <div className="welcome-header">
              <h2>Bem-vindo(a), {userName}!</h2>
              <p>Tenha um ótimo dia de trabalho. 😊</p>
            </div>
            <div className="search-hero-container">
              <PacientesResumo
                pacientes={pacientes}
                pacienteEtapa={pacienteEtapa}
                setPacienteEtapa={setPacienteEtapa}
                setPacienteSelecionadoId={setPacienteSelecionadoId}
                onPesquisar={handlePesquisarPacientes}
              />
            </div>
          </>
        )}

        {activeTab === 'visao-geral' && (
          <section className="dashboard-grid-2x2">

            {/* 1. Lista de Espera (Top Left) */}
            <div className="widget-card">
              <ListaEsperaResumo key={refreshKey} pacienteId={pacienteSelecionadoId} />
            </div>

            {/* 2. Agendamentos (Top Right) */}
            <div className="widget-card">
              <AgendamentosResumo key={refreshKey} pacienteId={pacienteSelecionadoId} />
            </div>

            {/* 3. Relatórios (Bottom Left) */}
            <div className="widget-card">
              <RelatorioResumo key={refreshKey} />
            </div>

            {/* 4. Salas (Bottom Right) */}
            <div className="widget-card">
              <SalasResumo key={refreshKey} />
            </div>

          </section>
        )}

      </div>
    </div>
  );
};

export default Home;
