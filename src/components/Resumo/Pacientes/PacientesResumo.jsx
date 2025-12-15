import React, { useState, useEffect, useRef } from 'react'; // Adicionado useRef
import './PacientesResumo.css';
import { useNavigate } from 'react-router-dom';

//FUNCTIONS
import GetPacienteEtapa from '../../../functions/Pacientes/GetPacienteEtapa';
import PesquisarPacientes from '../../Pacientes/PesquisarPacientes';

const PacientesResumo = ({
  pacientes,
  pacienteEtapa,
  setPacienteEtapa,
  setPacienteSelecionadoId,
  onPesquisar,
}) => {
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // NOVO: Estado para controlar visibilidade do dropdown
  const [showDropdown, setShowDropdown] = useState(false);

  // NOVO: Ref para detectar cliques fora do componente
  const searchRef = useRef(null);

  const navigate = useNavigate();

  // Resetar seleção quando a lista muda
  useEffect(() => {
    setSelectedPaciente(null);
  }, [pacientes]);

  // NOVO: Effect para fechar o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const selectedPatientData = selectedPaciente !== null ? pacientes.find(p => p.id === selectedPaciente) : null;

  const handleSelectPaciente = (id) => {
    setSelectedPaciente(id);
    // Opcional: Não fechar o dropdown imediatamente para permitir ver a seleção, 
    // ou fechar se a intenção for selecionar e pronto. 
    // Mantendo aberto para permitir clicar em "Rastrear".
  };

  const handleNext = async () => {
    if (selectedPaciente !== null) {
      setIsLoading(true);
      try {
        const paciente = pacientes.find(p => p.id === selectedPaciente);
        if (!paciente) throw new Error("Paciente não encontrado");

        const etapa = await GetPacienteEtapa(paciente.id);
        setPacienteSelecionadoId(paciente.id);
        setPacienteEtapa(etapa.data);
        setShowDropdown(false); // Fecha dropdown ao avançar
      } catch (error) {
        console.error('Erro ao buscar etapa do paciente:', error);
        alert('Erro ao localizar paciente. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ... (Componente PatientStepper permanece igual) ...
  const PatientStepper = ({ etapa }) => {
    const steps = [
      { id: 1, label: 'Cadastro' },
      { id: 2, label: 'Lista de Espera' },
      { id: 3, label: 'Agendamento' },
      { id: 4, label: 'Consulta' }
    ];

    const getStepClass = (stepId) => {
      let current = etapa;
      if (etapa === 5) current = 1;

      if (current >= stepId) return 'step-item active';
      return 'step-item';
    };

    return (
      <div className="stepper-container">
        {steps.map((step, index) => (
          <div key={step.id} className={getStepClass(step.id)}>
            <div className="step-circle">
              {getStepClass(step.id).includes('active') ? '✔' : step.id}
            </div>
            <span className="step-label">{step.label}</span>
            {index < steps.length - 1 && <div className="step-line"></div>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pacientes-resumo hero-mode">
      <div className="pacientes-resumo__body">

        {/* MODO 1: RASTREAMENTO ATIVO (STEPPER) */}
        {pacienteEtapa ? (
          <div className="stepper-wrapper">
            <div className="selected-patient-info">
              <p>Paciente: <strong>{selectedPatientData?.nome}</strong></p>
            </div>
            <PatientStepper etapa={pacienteEtapa} />
          </div>
        ) : (
          /* MODO 2: BUSCA + LISTA DE RESULTADOS (Interativo) */
          /* Adicionado ref={searchRef} para gerenciar o clique fora */
          <div ref={searchRef} className="search-interaction-wrapper">

            <div
              className="search-section"
              onClick={() => setShowDropdown(true)}
              onFocus={() => setShowDropdown(true)} // Garante que tabulação/foco ative
            >
              <PesquisarPacientes
                onPesquisar={onPesquisar}
                placeholder="Busque um paciente por nome..."
              />
            </div>

            {/* CONDICIONAL: Só exibe resultados se showDropdown for true */}
            {showDropdown && (
              <div className="results-list animate-fade-in">
                {pacientes && pacientes.length > 0 ? (
                  pacientes.slice(0, 3).map((paciente, index) => (
                    <div
                      className={`pacientes-relatorio__item ${selectedPaciente === paciente.id ? 'selected' : ''}`}
                      key={paciente.id || index}
                      onClick={() => handleSelectPaciente(paciente.id)}
                    >
                      <div className="paciente-item__selection">
                        <div
                          className={`radio-indicator ${selectedPaciente === paciente.id ? 'active' : ''}`}
                        ></div>
                      </div>
                      <div className="paciente-item__content">
                        <span className="paciente-name">{paciente.nome}</span>
                        <span className="paciente-detail">
                          {paciente.telefone || 'Sem telefone'} • {paciente.idade ? `${paciente.idade} anos` : 'Idade n/i'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-pacientes">
                    <button onClick={() => navigate('/pacientes')}>
                      Clique aqui para cadastrar um novo paciente...
                    </button>
                  </div>
                )}

                {/* FOOTER MOVIDO PARA DENTRO DO DROPDOWN PARA VISUAL INTEGRADO */}
                {/* Se preferir que o botão apareça fora, mova este bloco para depois do fechamento da results-list */}
                {selectedPaciente !== null && (
                  <div className="pacientes-resumo__footer_integrated">
                    <button
                      className="btn-rastrear"
                      onClick={(e) => {
                        e.stopPropagation(); // Previne fechar o dropdown ao clicar no botão
                        handleNext();
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Localizando...' : 'Rastrear Paciente'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer de Limpar Rastreio permanece fora */}
      {pacienteEtapa && (
        <div className="pacientes-resumo__footer">
          <button onClick={() => {
            setPacienteEtapa(null);
            setPacienteSelecionadoId(null);
            setSelectedPaciente(null);
          }}>
            Limpar Rastreio
          </button>
        </div>
      )}
    </div>
  );
};

export default PacientesResumo;