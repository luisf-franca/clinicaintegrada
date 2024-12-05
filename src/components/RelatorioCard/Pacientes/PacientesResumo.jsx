import React, { useState } from 'react';
import './PacientesResumo.css';

const PacientesResumo = () => {
    const [quantidadeTotalPacientes, setQuantidadeTotalPacientes] = useState(100); // Exemplo inicial
    const [quantidadePacientesHomens, setQuantidadePacientesHomens] = useState(40); // Exemplo inicial
    const [quantidadePacientesMulheres, setQuantidadePacientesMulheres] = useState(60); // Exemplo inicial

    return (
        <div className="pacientes-resumo">
            {/* Header com título */}
            <div className="pacientes-resumo__header">
                <h4>Pacientes</h4>
            </div>

            {/* Corpo do resumo */}
            <div className="pacientes-resumo__body">
                <table className="pacientes-resumo__table">
                    <thead>
                        <tr>
                            <th>Categoria</th>
                            <th>Quantidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Total de Pacientes</td>
                            <td>{quantidadeTotalPacientes}</td>
                        </tr>
                        <tr>
                            <td>Pacientes Homens</td>
                            <td>{quantidadePacientesHomens}</td>
                        </tr>
                        <tr>
                            <td>Pacientes Mulheres</td>
                            <td>{quantidadePacientesMulheres}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PacientesResumo;
