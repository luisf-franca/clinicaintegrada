import React, { useState, useEffect, useCallback } from 'react';
import '../styles/home.css';

// COMPONENTS
import ListaEsperaResumo from '../components/Resumo/ListaEspera/ListaEsperaResumo';
import AgendamentosResumo from '../components/Resumo/Agendamentos/AgendamentosResumo';

// import ConsultaResumo from '../components/Resumo/Consultas/ConsultaResumo';
import SalasResumo from '../components/Resumo/Salas/SalasResumo';
import PacientesResumo from '../components/Resumo/Pacientes/PacientesResumo';

// FUNCTIONS
import GetPacientes from '../functions/Pacientes/GetPacientes';

const Home = () => {
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

  // EFEITO REMOVIDO: A lógica de mudar abas automatica foi trocada pelo dashboard unificado.
  // O filtro visual agora acontece via props nos cards.

  return (
    <div className="home container">
      <div className="home-header">
        <h1>Início</h1>
      </div>
      <div className="home-body home-dashboard">

        {/* HERO SECTION: RASTREADOR DE PACIENTES */}
        <section className="dashboard-hero">
          <PacientesResumo
            pacientes={pacientes}
            pacienteEtapa={pacienteEtapa}
            setPacienteEtapa={setPacienteEtapa}
            setPacienteSelecionadoId={setPacienteSelecionadoId}
            onPesquisar={handlePesquisarPacientes}
          />
        </section>

        {/* WIDGETS GRID */}
        <section className="dashboard-grid">

          <div className="widget-card">
            <ListaEsperaResumo pacienteId={pacienteSelecionadoId} />
          </div>

          <div className="widget-card">
            <AgendamentosResumo pacienteId={pacienteSelecionadoId} />
          </div>

          <div className="widget-card">
            <SalasResumo />
          </div>

        </section>

      </div>
    </div>
  );
};

export default Home;
