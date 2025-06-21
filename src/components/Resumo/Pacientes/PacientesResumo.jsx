import React, { useState } from 'react';
import './PacientesResumo.css';
import { useNavigate } from 'react-router-dom';

//FUNCTIONS
import GetPacienteEtapa from '../../../functions/Pacientes/GetPacienteEtapa';
import PesquisarPacientes from '../../Pacientes/PesquisarPacientes';

const PacientesResumo = ({
  pacientes,
  setPacienteEtapa,
  setPacienteSelecionadoId,
  onPesquisar,
}) => {
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const navigate = useNavigate(); // Hook para navegação

  const handleSelectPaciente = (index) => {
    setSelectedPaciente(index);
  };

  const handleNext = async () => {
    if (selectedPaciente !== null) {
      const paciente = pacientes[selectedPaciente];
      // Lógica para identificar a etapa do paciente e redirecionar
      var etapa = await GetPacienteEtapa(paciente.id);
      setPacienteSelecionadoId(paciente.id);
      setPacienteEtapa(etapa.data);
    }
  };

  const handleNavigatePacientes = () => {
    navigate('/pacientes'); // Navegação sem query string
  };

  return (
    <div className="pacientes-resumo">
      <div className="pacientes-resumo__header">
        <h4>Pacientes</h4>
        <button onClick={handleNavigatePacientes}>Novo Registro</button>
      </div>
      <div className="pacientes-resumo__body">
        <PesquisarPacientes onPesquisar={onPesquisar} />
        {pacientes && pacientes.length > 0 ? (
          pacientes.slice(0, 5).map((paciente, index) => (
            <div
              className={`pacientes-relatorio__item ${
                selectedPaciente === index ? 'selected' : ''
              }`}
              key={index}
              onClick={() => handleSelectPaciente(index)}
            >
              <div className="paciente-item__button">
                <div
                  className={`round-button ${
                    selectedPaciente === index ? 'marked' : ''
                  }`}
                ></div>
              </div>
              <div className="paciente-item__info">
                <p>
                  <strong>Nome:</strong> {paciente.nome}
                </p>
                <p>
                  <strong>Telefone:</strong> {paciente.telefone}
                </p>
                <p>
                  <strong>Idade:</strong> {paciente.idade}
                </p>
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
