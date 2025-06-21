import React, { useState } from 'react';
import './EquipesRelatorio.css';

const EquipesRelatorio = () => {
  const [quantidadeEquipes, setQuantidadeEquipes] = useState(5);
  const [quantidadeProfessores, setQuantidadeProfessores] = useState(12);
  const [quantidadeEstagiarios, setQuantidadeEstagiarios] = useState(8);

  return (
    <div className="equipes-profissionais-relatorio">
      <div className="equipes-profissionais-relatorio__header">
        <h4>Equipes</h4>
      </div>

      <div className="equipes-profissionais-relatorio__body">
        <table className="equipes-profissionais-relatorio__table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Equipes</td>
              <td>{quantidadeEquipes}</td>
            </tr>
            <tr>
              <td>Professores</td>
              <td>{quantidadeProfessores}</td>
            </tr>
            <tr>
              <td>Estagiários</td>
              <td>{quantidadeEstagiarios}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipesRelatorio;
