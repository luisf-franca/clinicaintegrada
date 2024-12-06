import React, { useState, useEffect } from 'react';
import './HomeCard.css';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

// COMPONENTS
import Especialidade from '../Especialidade/Especialidade';
import ListaEsperaResumo from './Resumo/ListaEspera/ListaEsperaResumo';
import AgendamentosResumo from './Resumo/Agendamentos/AgendamentosResumo';
import SalasResumo from './Resumo/Salas/SalasResumo';
import PesquisarPacientes from '../PatientCard/Pacientes/PesquisarPacientes';
import PacientesResumo from './Resumo/Pacientes/PacientesResumo';

const HomeCard = () => {
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
        <div className="home-card">
            <div className="home-card-header">
                <h1>Clínica Integrada</h1>
                <Especialidade
                    selectedSpecialty={selectedSpecialty}
                    onSelectSpecialty={setSelectedSpecialty}
                />
            </div>
            <div className="home-card-body">
                <Tabs selectedIndex={activeTab} onSelect={handleTabChange}>
                    <TabList>
                        <Tab>Pacientes</Tab>
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
                            <AgendamentosResumo />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="body-section">
                            <ListaEsperaResumo />
                            <SalasResumo />
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
};

export default HomeCard;
