import React, { useState, useEffect } from 'react';
import './HomeCard.css';

// COMPONENTS
import Especialidade from '../Especialidade/Especialidade';
import ListaEsperaResumo from './Resumo/ListaEspera/ListaEsperaResumo';
import AgendamentosResumo from './Resumo/Agendamentos/AgendamentosResumo';
import SalasResumo from './Resumo/Salas/SalasResumo';
import PesquisarPacientes from '../PatientCard/Pacientes/PesquisarPacientes';

const HomeCard = () => {
    const [selectedSpecialty, setSelectedSpecialty] = useState(0); // Armazena o valor inteiro da especialidade selecionada
    const [pacientes, setPacientes] = useState([]); // Armazena a lista de pacientes

    useEffect(() => {
        if (selectedSpecialty !== null) {
            console.log(`Especialidade selecionada: ${selectedSpecialty}`);
        }
    }, [selectedSpecialty]);

    return (
        <div className="home-card">
            <div className="home-card-header">
                <h1>Home</h1>
                <Especialidade
                    selectedSpecialty={selectedSpecialty}
                    onSelectSpecialty={setSelectedSpecialty}
                />
            </div>
            <div className="home-card-body">
                <div className="body-section">
                    <div className="pesquisar-pacientes">
                        <PesquisarPacientes setPacientes={setPacientes} />
                    </div>
                    <div className="component">
                        <ListaEsperaResumo />
                    </div>
                </div>

                <div className="body-section">
                    <div className="component">
                        <AgendamentosResumo />
                    </div>
                </div>

                <div className="body-section">
                    <div className="component">
                        <SalasResumo />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeCard;
