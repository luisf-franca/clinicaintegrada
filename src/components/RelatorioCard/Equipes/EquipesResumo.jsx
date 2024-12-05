import React, { useState } from 'react';
import './EquipesResumo.css';

const EquipesEProfissionaisResumo = () => {
    const [quantidadeEquipes, setQuantidadeEquipes] = useState(5); // Exemplo inicial
    const [quantidadeProfessores, setQuantidadeProfessores] = useState(12); // Exemplo inicial
    const [quantidadeEstagiarios, setQuantidadeEstagiarios] = useState(8); // Exemplo inicial

    return (
        <div className="equipes-profissionais-resumo">
            {/* Header com título */}
            <div className="equipes-profissionais-resumo__header">
                <h4>Equipes</h4>
            </div>

            {/* Corpo do resumo */}
            <div className="equipes-profissionais-resumo__body">
                <table className="equipes-profissionais-resumo__table">
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

export default EquipesEProfissionaisResumo;
