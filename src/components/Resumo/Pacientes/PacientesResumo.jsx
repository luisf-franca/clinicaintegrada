import React, { useState, useEffect } from 'react';
import './PacientesResumo.css';
import { useNavigate } from 'react-router-dom';

//FUNCTIONS
import GetPacienteEtapa from '../../../functions/Pacientes/GetPacienteEtapa';
import PesquisarPacientes from '../../Pacientes/PesquisarPacientes';

const PacientesResumo = ({
  pacientes,
  pacienteEtapa, // Novo prop
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


  // Helper Component para o Stepper
  const PatientStepper = ({ etapa }) => {
    const steps = [
      { id: 1, label: 'Cadastro' },
      { id: 2, label: 'Lista de Espera' },
      { id: 3, label: 'Agendamento' },
      { id: 4, label: 'Consulta' },
    ];

    // Lógica simples: se etapa atual >= step.id, então está ativo (exceto cancelados/específicos se houver, mas seguindo o pedido linear)
    // Ajuste para etapa 5 (Cancelada) talvez tratar como step 2 ou visual específico. 
    // O usuario pediu: "Se o paciente estiver na etapa 2, as etapas 1 e 2 ficam vermelhas".
    // Vamos assumir progressão linear por ID para 1, 2, 3, 4.
    // Se etapa for 5, vou deixar como se fosse 2 (ainda na lista/pendente) ou algo assim, mas por enquanto linear.

    const getStepClass = (stepId) => {
      // Se etapa 5 (Cancelada), vamos considerar que parou em lista de espera ou similar, ou tratar a parte.
      // Mas para o básico:
      let current = etapa;
      if (etapa === 5) current = 2; // Treat canceled as waiting list level for visual or just stop. 

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
    <div className="pacientes-resumo tracker-card">
      <div
        className="pacientes-resumo__header widget-header"
        onClick={() => navigate('/pacientes')}
        title="Ver todos os pacientes"
      >
        <h4>Pacientes ↗</h4>
        {/* <button
          onClick={(e) => {
            e.stopPropagation(); // Evita navegar ao clicar no botão
            handleNavigatePacientes();
          }}
          className="btn-novo-paciente"
        >
          Novo Paciente
        </button> */}
      </div>

      <div className="pacientes-resumo__body">

        {/* BUSCA */}
        <div className="search-section">
          <PesquisarPacientes onPesquisar={onPesquisar} />
        </div>

        {/* STEPPER VISUAL (Só aparece se tiver paciente selecionado/etapa definida) */}
        {pacienteEtapa && selectedPaciente !== null && (
          <div className="stepper-wrapper">
            <PatientStepper etapa={pacienteEtapa} />
            <div className="selected-patient-info">
              <p>Paciente Selecionado: <strong>{pacientes[selectedPaciente]?.nome}</strong></p>
            </div>
          </div>
        )}

        {/* LISTA DE RESULTADOS (Mostra só se não tiver selecionado ou se quiser mudar) */}
        {(!pacienteEtapa || selectedPaciente === null) && (
          <div className="results-list">
            {pacientes && pacientes.length > 0 ? (
              pacientes.slice(0, 3).map((paciente, index) => (
                <div
                  className={`pacientes-relatorio__item ${selectedPaciente === index ? 'selected' : ''
                    }`}
                  key={paciente.id || index}
                  onClick={() => handleSelectPaciente(index)}
                >
                  <div className="paciente-item__selection">
                    <div
                      className={`radio-indicator ${selectedPaciente === index ? 'active' : ''
                        }`}
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
              <div className="no-pacientes">Utilize a busca para localizar um paciente.</div>
            )}
          </div>
        )}
      </div>

      {/* Footer renderizado para permitir rastreio, desabilitado se nenhum selecionado */}
      {!pacienteEtapa && (
        <div className="pacientes-resumo__footer">
          <button
            onClick={handleNext}
            disabled={selectedPaciente === null || isLoading}
          >
            {isLoading ? 'Localizando...' : 'Rastrear Paciente'}
          </button>
        </div>
      )}

      {/* Botão de Limpar Rastreio se já estiver rastreando */}
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
