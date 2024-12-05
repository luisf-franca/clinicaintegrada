import React, { useState } from 'react';
import './home.css';

// COMPONENTS
import Especialidade from '../../components/Especialidade/Especialidade';
import SideBar from '../../components/SideBar/SideBar';
import HomeCard from '../../components/HomeCard/HomeCard';
import PatientCard from '../../components/PatientCard/PatientCard';
import ListaEsperaCard from '../../components/ListaEsperaCard/ListaEsperaCard';

const Home = () => {
  // Estado para controlar o componente selecionado
  const [selectedComponent, setSelectedComponent] = useState('Inicio');

  // Função para atualizar o componente selecionado
  const handleSelection = (componentName) => {
    setSelectedComponent(componentName);
  };

  return (
    <section className="pages">
      <main className="container">
        <SideBar onSelection={handleSelection} />
        {selectedComponent === 'Inicio' && <HomeCard/>}
        {selectedComponent === 'ListaEsperaCard' && <ListaEsperaCard />}
        {selectedComponent === 'PatientCard' && <PatientCard />}
        {selectedComponent === 'AgendamentoCard' && <h1>Agendamento</h1>}
        {selectedComponent === 'ConsultaCard' && <h1>Consulta</h1>}
        {selectedComponent === 'RelatorioCard' && <h1>Relatório</h1>}
        {selectedComponent === 'EquipeCard' && <h1>Equipe</h1>}
        {selectedComponent === 'SalaCard' && <h1>Sala</h1>}
      </main>
    </section>
  );
};

export default Home;
