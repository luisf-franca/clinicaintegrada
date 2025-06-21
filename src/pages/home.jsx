import React, { useState, useEffect, useCallback } from 'react';
import '../styles/home.css';

// COMPONENTS
import Especialidade from '../components/Especialidade/Especialidade';
import ListaEsperaResumo from '../components/Resumo/ListaEspera/ListaEsperaResumo';
import AgendamentosResumo from '../components/Resumo/Agendamentos/AgendamentosResumo';
import ConsultaResumo from '../components/Resumo/Consultas/ConsultaResumo';
import SalasResumo from '../components/Resumo/Salas/SalasResumo';
import PacientesResumo from '../components/Resumo/Pacientes/PacientesResumo';

// FUNCTIONS
import GetPacientes from '../functions/Pacientes/GetPacientes';

const Home = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    localStorage.getItem('selectedSpecialty') || 1,
  );

  const [pacientes, setPacientes] = useState([]);
  const [pacienteEtapa, setPacienteEtapa] = useState(null);
  const [pacienteSelecionadoId, setPacienteSelecionadoId] = useState(null);

  const [activeTab, setActiveTab] = useState(0);

  const tabList = [
    { label: 'Pacientes' },
    { label: 'Lista de Espera' },
    { label: 'Agendamentos' },
    { label: 'Consultas' },
  ];

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

  useEffect(() => {
    if (activeTab === 0) {
      setPacienteSelecionadoId(null);
      setPacienteEtapa(null);
    }
  }, [activeTab]);

  useEffect(() => {
    if (pacienteEtapa !== null) {
      switch (pacienteEtapa) {
        case 1:
          setActiveTab(1);
          break;
        case 2:
          setActiveTab(2);
          break;
        case 3:
        case 4:
          setActiveTab(3);
          break;
        case 5:
          setActiveTab(1);
          break;
        default:
          break;
      }
    }
  }, [pacienteEtapa]);

  return (
    <div className="home container">
      <div className="home-header">
        <h1>Início</h1>
        <Especialidade
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={setSelectedSpecialty}
        />
      </div>
      <div className="home-body">
        <div className="tab-bar">
          {tabList.map((tab, idx) => (
            <button
              key={tab.label}
              className={`tab-btn${activeTab === idx ? ' active' : ''}`}
              onClick={() => setActiveTab(idx)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {activeTab === 0 && (
            <div className="body-section">
              <PacientesResumo
                pacientes={pacientes}
                setPacienteEtapa={setPacienteEtapa}
                setPacienteSelecionadoId={setPacienteSelecionadoId}
                onPesquisar={handlePesquisarPacientes}
              />
            </div>
          )}
          {activeTab === 1 && (
            <div className="body-section">
              <ListaEsperaResumo pacienteId={pacienteSelecionadoId} />
            </div>
          )}
          {activeTab === 2 && (
            <div className="body-section">
              <AgendamentosResumo pacienteId={pacienteSelecionadoId} />
            </div>
          )}
          {activeTab === 3 && (
            <div className="body-section">
              <ConsultaResumo pacienteId={pacienteSelecionadoId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
