import React, { useState } from 'react';
import './PacientesRelatorio.css';

const PacientesRelatorio = () => {
  const [quantidadeTotalPacientes, setQuantidadeTotalPacientes] = useState(100);
  const [quantidadePacientesHomens, setQuantidadePacientesHomens] =
    useState(40);
  const [quantidadePacientesMulheres, setQuantidadePacientesMulheres] =
    useState(60);

  return (
    <div className="pacientes-relatorio">
      <div className="pacientes-relatorio__header">
        <h4>Pacientes</h4>
      </div>

      <div className="pacientes-relatorio__body">
        <table className="pacientes-relatorio__table">
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

export default PacientesRelatorio;
