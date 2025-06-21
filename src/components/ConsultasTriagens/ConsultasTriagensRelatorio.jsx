import React, { useState } from 'react';
import './ConsultasTriagensRelatorio.css';

const ConsultasTriagensRelatorio = () => {
  const [quantidadeConsultasAgendadas, setQuantidadeConsultasAgendadas] =
    useState(15);
  const [quantidadeConsultasEmAndamento, setQuantidadeConsultasEmAndamento] =
    useState(8);
  const [quantidadeConsultasConcluidas, setQuantidadeConsultasConcluidas] =
    useState(12);

  return (
    <div className="consultas-triagens-relatorio">
      <div className="consultas-triagens-relatorio__header">
        <h4>Consultas e Triagens</h4>
      </div>

      <div className="consultas-triagens-relatorio__body">
        <table className="consultas-triagens-relatorio__table">
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

export default ConsultasTriagensRelatorio;
