import React, { useState, useEffect } from 'react';
import './HomeCard.css';

// COMPONENTS
import Especialidade from '../Especialidade/Especialidade';
import ListaEsperaResumo from './Resumo/ListaEspera/ListaEsperaResumo';
import ConsultasTriagensResumo from './Resumo/ConsultasTriagens/ConsultasTriagensResumo';

const HomeCard = () => {
    const [selectedSpecialty, setSelectedSpecialty] = useState(0); // Armazena o valor inteiro da especialidade selecionada
    
    useEffect(() => {
        if (selectedSpecialty !== null) {
            console.log(`Especialidade selecionada: ${selectedSpecialty}`);
        }
    }, [selectedSpecialty]);

    return (
        <div className="home-card">
            <div className="home-card-header">
                <h1>Home</h1>
                {/* Passando o estado e a função de atualização para o componente Especialidade */}
                <Especialidade
                    selectedSpecialty={selectedSpecialty}
                    onSelectSpecialty={setSelectedSpecialty}
                />
            </div>
            <div className="home-card-body">
                {/* Primeira div com 2 componentes */}
                <div className="body-section">
                    <div className="component">
                        <ListaEsperaResumo />
                    </div>
                    <div className="component">
                        <ConsultasTriagensResumo />
                    </div>
                </div>

                {/* Segunda div com 1 componente */}
                <div className="body-section">
                    <div className="component">Agendamentos</div>
                </div>

                {/* Terceira div com 3 componentes */}
                <div className="body-section">
                    <div className="component">Equipes</div>
                    <div className="component">Pacientes</div>
                    <div className="component">Salas</div>
                </div>
            </div>
        </div>
    );
};

export default HomeCard;
