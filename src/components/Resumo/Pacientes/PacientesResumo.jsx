import React, { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Resetar seleção quando a lista de pacientes mudar
  useEffect(() => {
    setSelectedPaciente(null);
  }, [pacientes]);

  const handleSelectPaciente = (index) => {
    setSelectedPaciente(index);
  };

  const handleNext = async () => {
    if (selectedPaciente !== null) {
      setIsLoading(true);
      try {
        const paciente = pacientes[selectedPaciente];
        const etapa = await GetPacienteEtapa(paciente.id);
        setPacienteSelecionadoId(paciente.id);
        setPacienteEtapa(etapa.data);
      } catch (error) {
        console.error('Erro ao buscar etapa do paciente:', error);
        alert('Erro ao localizar paciente. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNavigatePacientes = () => {
    navigate('/pacientes?view=add');
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
              key={paciente.id || index}
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
        <button 
          onClick={handleNext} 
          disabled={selectedPaciente === null || isLoading}
        >
          {isLoading ? 'Localizando...' : 'Localizar Paciente'}
        </button>
      </div>
    </div>
  );
};

export default PacientesResumo;
