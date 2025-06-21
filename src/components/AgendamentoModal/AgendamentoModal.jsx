import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './AgendamentoModal.css';

// COMPONENTS
import PesquisarPacientes from '../Pacientes/PesquisarPacientes';
import PesquisarEquipes from '../Equipes/PesquisarEquipes';
import SelectSala from '../Salas/SelectSala';
import Especialidade from '../Especialidade/Especialidade';

// FUNCTIONS
import CreateAgendamento from '../../functions/Agendamentos/CreateAgendamento';

const AgendamentoModal = ({
  isModalOpen,
  setIsModalOpen,
  modalData,
  atualizarRegistros,
}) => {
  const [step, setStep] = useState(1); // Controle dos passos

  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  const [equipes, setEquipes] = useState([]);
  const [equipeSelecionada, setEquipeSelecionada] = useState(null);

  const [reservarSala, setReservarSala] = useState(false);

  const [requestData, setRequestData] = useState({
    agendamento: {
      dataHoraInicio: modalData.startSlot,
      dataHoraFim: modalData.endSlot,
      tipo: 1,
      status: 1,
      pacienteId: modalData.pacienteId,
      salaId: '',
    },
    consulta: {
      observacao: '',
      especialidade: localStorage.getItem('selectedSpecialty') || 1,
      equipeId: '',
    },
  });

  // Monitorar mudanças em requestData
  useEffect(() => {
    // console.log(requestData);
  }, [requestData]);

  const handlePacienteChange = (pacienteId) => {
    setPacienteSelecionado(pacienteId);
    setRequestData((prev) => ({
      ...prev,
      agendamento: { ...prev.agendamento, pacienteId },
    }));
  };

  const handleReservarSalaChange = (event) => {
    setReservarSala(event.target.checked);
    if (!event.target.checked) {
      setRequestData((prevState) => ({
        ...prevState,
        agendamento: {
          ...prevState.agendamento,
          salaId: null,
        },
      }));
    }
  };

  const getDiaStringFromDateTime = (dateTime) => {
    const dateObj = new Date(dateTime);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return dateObj.toLocaleDateString('pt-BR', options);
  };

  const formatDateTimeToLocal = (dateTimeString) => {
    const dateObj = new Date(dateTimeString);

    // Obtém as horas e minutos no formato 24 horas
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    // Retorna no formato HH:mm
    return `${hours}:${minutes}`;
  };

  const handlePostAgendamento = async () => {
    try {
      requestData.agendamento.status = parseInt(
        requestData.agendamento.status,
        10,
      );
      requestData.agendamento.tipo = parseInt(requestData.agendamento.tipo, 10);
      requestData.consulta.especialidade = parseInt(
        requestData.consulta.especialidade,
        10,
      );
      const response = await CreateAgendamento(requestData);
      atualizarRegistros();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      // alert('Erro ao criar agendamento. Por favor, tente novamente.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label>
              <div>
                <PesquisarPacientes
                  setPacientes={setPacientes}
                  onSelectPaciente={handlePacienteChange}
                />
                {pacienteSelecionado && (
                  <button
                    type="button"
                    onClick={() => {
                      setPacienteSelecionado(null);
                      setRequestData((prev) => ({
                        ...prev,
                        agendamento: { ...prev.agendamento, pacienteId: '' },
                      }));
                    }}
                  >
                    Resetar
                  </button>
                )}
              </div>
            </label>

            <label>
              Especialidade
              <Especialidade
                selectedSpecialty={requestData.consulta.especialidade || ''}
                onSelectSpecialty={(especialidade) =>
                  setRequestData((prev) => ({
                    ...prev,
                    consulta: { ...prev.consulta, especialidade },
                  }))
                }
              />
            </label>
            <label>
              Tipo
              <div>
                <select
                  name="tipo"
                  value={requestData.agendamento.tipo || 0}
                  onChange={(e) =>
                    setRequestData({
                      ...requestData,
                      agendamento: {
                        ...requestData.agendamento,
                        tipo: e.target.value,
                      },
                    })
                  }
                >
                  <option value={1}>Triagem</option>
                  <option value={2}>Consulta</option>
                </select>
              </div>
            </label>
          </>
        );

      case 2:
        return (
          <>
            <div>
              <label>
                Equipe
                <div>
                  <select
                    name="equipeId"
                    value={requestData.consulta.equipeId || ''}
                    onChange={(e) => {
                      const equipeId = e.target.value;
                      setEquipeSelecionada(equipeId);
                      setRequestData((prev) => ({
                        ...prev,
                        consulta: { ...prev.consulta, equipeId },
                      }));
                    }}
                    required
                  >
                    <option value={null}>Selecione a equipe</option>
                    {equipes.map((equipe) => (
                      <option key={equipe.id} value={equipe.id}>
                        {equipe.nome}
                      </option>
                    ))}
                  </select>

                  {equipeSelecionada && (
                    <button
                      type="button"
                      onClick={() => {
                        setEquipeSelecionada(null);
                        setRequestData((prev) => ({
                          ...prev,
                          consulta: { ...prev.consulta, equipeId: '' },
                        }));
                      }}
                    >
                      Resetar
                    </button>
                  )}
                </div>
              </label>

              <label>
                {equipeSelecionada === null && (
                  <PesquisarEquipes
                    setEquipes={setEquipes}
                    especialidade={requestData.consulta.especialidade}
                  />
                )}
              </label>

              <label class="custom-checkbox">
                Reservar sala?
                <input
                  type="checkbox"
                  checked={reservarSala}
                  onChange={handleReservarSalaChange}
                />
              </label>
              {reservarSala && (
                <label>
                  <SelectSala
                    especialidade={requestData.consulta.especialidade}
                    onSelectSala={(salaId) => {
                      setRequestData((prevState) => ({
                        ...prevState,
                        agendamento: {
                          ...prevState.agendamento,
                          salaId,
                        },
                      }));
                    }}
                  />
                </label>
              )}

              <label>
                Observações
                <textarea
                  placeholder="Observações"
                  value={requestData.consulta.observacao || ''}
                  onChange={(e) =>
                    setRequestData({
                      ...requestData,
                      consulta: {
                        ...requestData.consulta,
                        observacao: e.target.value,
                      },
                    })
                  }
                />
              </label>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    isModalOpen &&
    ReactDOM.createPortal(
      <div className="overlay fade-in" onClick={() => setIsModalOpen(false)}>
        <div className="agendar-modal" onClick={(e) => e.stopPropagation()}>
          <hgroup>
            <h3>Agendar</h3>
            <div className="time-range">
              <span>
                {getDiaStringFromDateTime(
                  requestData.agendamento.dataHoraInicio,
                )}
              </span>
              <span>
                Início:{' '}
                {formatDateTimeToLocal(requestData.agendamento.dataHoraInicio)}
              </span>
              <span>
                Término:{' '}
                {formatDateTimeToLocal(requestData.agendamento.dataHoraFim)}
              </span>
            </div>
          </hgroup>

          <form>{renderStep()}</form>

          <div className="step-buttons">
            {/* Botão para voltar */}
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prevStep) => prevStep - 1)}
              >
                Voltar
              </button>
            )}
            {/* Botão para avançar */}
            {step < 2 && pacienteSelecionado && (
              <button
                type="button"
                onClick={() => setStep((prevStep) => prevStep + 1)}
              >
                Avançar
              </button>
            )}
            {/* Botão para salvar no último passo */}
            {step === 2 && (
              <button onClick={handlePostAgendamento}>Salvar</button>
            )}
            {/* Botão para cancelar */}
            <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      </div>,
      document.body,
    )
  );
};

export default AgendamentoModal;
