import React, { useState } from 'react';
import './ConsultasTriagensResumo.css';

const ConsultasTriagensResumo = () => {
    const [quantidadeConsultasAgendadas, setQuantidadeConsultasAgendadas] = useState(15); // Exemplo inicial
    const [quantidadeConsultasEmAndamento, setQuantidadeConsultasEmAndamento] = useState(8); // Exemplo inicial
    const [quantidadeConsultasConcluidas, setQuantidadeConsultasConcluidas] = useState(12); // Exemplo inicial

    return (
        <div className="consultas-triagens-resumo">
            {/* Header com título */}
            <div className="consultas-triagens-resumo__header">
                <h4>Consultas/Triagens</h4>
            </div>

            {/* Corpo do resumo */}
            <div className="consultas-triagens-resumo__body">
                <table className="consultas-triagens-resumo__table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Quantidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Agendadas</td>
                            <td>{quantidadeConsultasAgendadas}</td>
                        </tr>
                        <tr>
                            <td>Em Andamento</td>
                            <td>{quantidadeConsultasEmAndamento}</td>
                        </tr>
                        <tr>
                            <td>Concluídas</td>
                            <td>{quantidadeConsultasConcluidas}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConsultasTriagensResumo;
