import React, { useState, useEffect } from 'react';
import '../styles/home.css';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

// COMPONENTS
import Especialidade from '../components/Especialidade/Especialidade';
import ListaEsperaResumo from '../components/Resumo/ListaEspera/ListaEsperaResumo';
import AgendamentosResumo from '../components/Resumo/Agendamentos/AgendamentosResumo';
import ConsultaResumo from '../components/Resumo/Consultas/ConsultaResumo';
import SalasResumo from '../components/Resumo/Salas/SalasResumo';
import PesquisarPacientes from '../components/Pacientes/PesquisarPacientes';
import PacientesResumo from '../components/Resumo/Pacientes/PacientesResumo';

const Home = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(localStorage.getItem('selectedSpecialty') || 1);

  const [pacientes, setPacientes] = useState([]);
  const [pacienteEtapa, setPacienteEtapa] = useState(null);
  const [pacienteSelecionadoId, setPacienteSelecionadoId] = useState(null);

  const [activeTab, setActiveTab] = useState(0);

  //monitore activeTab, se for alterada para Pacientes, deve limpar o pacienteSelecionadoId e pacienteEtapa
  useEffect(() => {
    if (activeTab === 0) {
      setPacienteSelecionadoId(null);
      setPacienteEtapa(null);
    }
  }, [activeTab]);

  //monitore pacienteEtapa, se for alterada, deve sugerir a funcionalidade de acordo com a etapa do paciente no sistema
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
          // console.log('Etapa desconhecida');
          break;
      }
    }
  }, [pacienteEtapa]);


  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1>Início</h1>
        <Especialidade
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={setSelectedSpecialty}
        />
      </div>
      <div className="home-body">
        <Tabs selectedIndex={activeTab} onSelect={handleTabChange}>
          <TabList>
            <Tab>Pacientes</Tab>
            <Tab>Lista de Espera</Tab>
            <Tab>Agendamentos</Tab>
            <Tab>Consultas</Tab>
            <Tab>Salas</Tab>
          </TabList>

          <TabPanel>
            <div className="body-section">
              <PesquisarPacientes setPacientes={setPacientes} />
              <PacientesResumo pacientes={pacientes} setPacienteEtapa={setPacienteEtapa} setPacienteSelecionadoId={setPacienteSelecionadoId} />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="body-section">
              <ListaEsperaResumo pacienteId={pacienteSelecionadoId} />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="body-section">
              <AgendamentosResumo pacienteId={pacienteSelecionadoId} />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="body-section">
              <ConsultaResumo pacienteId={pacienteSelecionadoId} />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="body-section">
              <SalasResumo especialidade={selectedSpecialty} />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
