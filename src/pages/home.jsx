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

const Home = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [pacientes, setPacientes] = useState([]);
  const [pacienteEtapa, setPacienteEtapa] = useState(null);
  const [pacienteSelecionadoId, setPacienteSelecionadoId] = useState(null);

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

  // Carregar pacientes iniciais
  useEffect(() => {
    handlePesquisarPacientes('');
  }, [handlePesquisarPacientes]);

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
      </div>
      <div className="home-body home-dashboard">

        {activeTab === 'inicio' && (
          <>
            <div className="welcome-header">
              <h2>Bem-vindo(a), Usuário!</h2>
              <p>Tenha um ótimo dia de trabalho.</p>
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
              <ListaEsperaResumo pacienteId={pacienteSelecionadoId} />
            </div>

            {/* 2. Agendamentos (Top Right) */}
            <div className="widget-card">
              <AgendamentosResumo pacienteId={pacienteSelecionadoId} />
            </div>

            {/* 3. Relatórios (Bottom Left) */}
            <div className="widget-card">
              <RelatorioResumo />
            </div>

            {/* 4. Salas (Bottom Right) */}
            <div className="widget-card">
              <SalasResumo />
            </div>

          </section>
        )}

      </div>
    </div>
  );
};

export default Home;
