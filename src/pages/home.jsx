import React, { useState, useEffect } from 'react';
import '../styles/home.css';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

// COMPONENTS
import Especialidade from '../components/Especialidade/Especialidade';
import ListaEsperaResumo from '../components/Resumo/ListaEspera/ListaEsperaResumo';
import AgendamentosResumo from '../components/Resumo/Agendamentos/AgendamentosResumo';
import SalasResumo from '../components/Resumo/Salas/SalasResumo';
import PesquisarPacientes from '../components/Pacientes/PesquisarPacientes';
import PacientesResumo from '../components/Resumo/Pacientes/PacientesResumo';

const Home = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(0);
  const [pacientes, setPacientes] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (selectedSpecialty !== null) {
      console.log(`Especialidade selecionada: ${selectedSpecialty}`);
    }
  }, [selectedSpecialty]);

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
            <Tab>Salas</Tab>
          </TabList>

          <TabPanel>
            <div className="body-section">
              <PesquisarPacientes setPacientes={setPacientes} />
              <PacientesResumo pacientes={pacientes} />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="body-section">
              <ListaEsperaResumo />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="body-section">
              <AgendamentosResumo />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="body-section">
              <SalasResumo />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
