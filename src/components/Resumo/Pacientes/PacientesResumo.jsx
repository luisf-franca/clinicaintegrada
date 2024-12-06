import React, { useState } from 'react';
import './PacientesResumo.css';

const PacientesResumo = ({ pacientes }) => {
    const [selectedPaciente, setSelectedPaciente] = useState(null);

    const handleSelectPaciente = (index) => {
        setSelectedPaciente(index);
    };

    const handleNext = () => {
        if (selectedPaciente !== null) {
            const paciente = pacientes[selectedPaciente];
            // Lógica para identificar a etapa do paciente e redirecionar
            console.log(`Paciente selecionado: ${paciente.id}`);
            // Redirecionar para a próxima fase
        }
    };

    return (
        <div className="pacientes-resumo">
            <div className="pacientes-resumo__header">
                <h4>Pacientes</h4>
            </div>
            <div className="pacientes-resumo__body">
                {pacientes && pacientes.length > 0 ? (
                    pacientes.slice(0, 5).map((paciente, index) => (
                        <div 
                            className={`paciente-item ${selectedPaciente === index ? 'selected' : ''}`} 
                            key={index} 
                            onClick={() => handleSelectPaciente(index)}
                        >
                            <div className="paciente-item__button">
                                <div className={`round-button ${selectedPaciente === index ? 'marked' : ''}`}></div>
                            </div>
                            <div className="paciente-item__info">
                                <p><strong>Nome:</strong> {paciente.nome}</p>
                                <p><strong>Telefone:</strong> {paciente.telefone}</p>
                                <p><strong>Idade:</strong> {paciente.idade}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-pacientes">Nenhum paciente encontrado.</div>
                )}
            </div>
            <div className="pacientes-resumo__footer">
                <button onClick={handleNext} disabled={selectedPaciente === null}>
                    Localizar Paciente
                </button>
            </div>
        </div>
    );
};

export default PacientesResumo;
