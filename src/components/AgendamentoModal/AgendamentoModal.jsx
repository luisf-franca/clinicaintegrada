import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './AgendamentoModal.css'; // Importa o novo CSS

// COMPONENTS
import PesquisarListaEspera from '../ListaEspera/PesquisarListaEspera';
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
  const [step, setStep] = useState(1);
  const [reservarSala, setReservarSala] = useState(!!modalData.salaId);
  const [registroListaEspera, setRegistroListaEspera] = useState(null);
  const [equipeSelecionada, setEquipeSelecionada] = useState(null);

  const [requestData, setRequestData] = useState({
    agendamento: {
      dataHoraInicio: modalData.startSlot,
      dataHoraFim: modalData.endSlot,
      tipo: 1,
      status: 1,
      pacienteId: modalData.pacienteId || '',
      nomePaciente: '',
      salaId: modalData.salaId || '',
    },
    consulta: {
      observacao: '',
      especialidade: localStorage.getItem('selectedSpecialty') || 1,
      equipeId: '',
    },
  });

  const handleStateChange = (section, field, value) => {
    setRequestData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleRegistroListaEsperaChange = (registro) => {
    setRegistroListaEspera(registro);
    handleStateChange('agendamento', 'pacienteId', registro.pacienteId);
    handleStateChange('agendamento', 'nomePaciente', '');
  };

  const handleLimparRegistroListaEspera = () => {
    setRegistroListaEspera(null);
    handleStateChange('agendamento', 'pacienteId', '');
  };

  const handleNomeChange = (nome) => {
    handleStateChange('agendamento', 'nomePaciente', nome);
  };

  const handleEquipeChange = (equipe) => {
    setEquipeSelecionada(equipe);
    handleStateChange('consulta', 'equipeId', equipe.id);
    handleStateChange('agendamento', 'nomeEquipe', equipe.nome);
  };

  const handleLimparEquipe = () => {
    setEquipeSelecionada(null);
    handleStateChange('consulta', 'equipeId', '');
    handleStateChange('agendamento', 'nomeEquipe', '');
  };

  const handleReservarSalaChange = (event) => {
    const isChecked = event.target.checked;
    setReservarSala(isChecked);
    if (!isChecked) {
      handleStateChange('agendamento', 'salaId', null);
    }
  };

  const getDiaStringFromDateTime = (dateTime) => {
    if (!dateTime) return '';
    const dateObj = new Date(dateTime);
    return dateObj.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTimeToLocal = (dateTimeString) => {
    if (!dateTimeString) return '';
    const dateObj = new Date(dateTimeString);
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handlePostAgendamento = async () => {
    try {
      if (reservarSala && !requestData.agendamento.salaId) {
        alert("Selecione uma sala ou desmarque a opção 'Reservar sala'.");
        return;
      }

      // Cria um payload limpo para o request, convertendo os valores
      const payload = {
        ...requestData,
        agendamento: {
          ...requestData.agendamento,
          tipo: parseInt(requestData.agendamento.tipo, 10),
          status: parseInt(requestData.agendamento.status, 10),
          pacienteId: requestData.agendamento.pacienteId || null,
          nomePaciente: !requestData.agendamento.pacienteId ? requestData.agendamento.nomePaciente : undefined,
        },
        consulta: {
          ...requestData.consulta,
          especialidade: parseInt(requestData.consulta.especialidade, 10),
        }
      };
      //console.log('Payload Criar Agendamento:', payload);
      await CreateAgendamento(payload);
      atualizarRegistros();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro ao criar agendamento. Verifique o console para mais detalhes.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="form-group">

              <PesquisarListaEspera
                especialidade={requestData.consulta.especialidade}
                onSelectRegistro={handleRegistroListaEsperaChange}
                registroSelecionado={registroListaEspera}
                onLimparRegistro={handleLimparRegistroListaEspera}
                onNomeChange={handleNomeChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="especialidade">Especialidade</label>
              <Especialidade
                id="especialidade"
                selectedSpecialty={requestData.consulta.especialidade || ''}
                onSelectSpecialty={(value) => handleStateChange('consulta', 'especialidade', value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipoAgendamento">Tipo</label>
              <select
                id="tipoAgendamento"
                name="tipo"
                value={requestData.agendamento.tipo}
                onChange={(e) => handleStateChange('agendamento', 'tipo', e.target.value)}
              >
                <option value={1}>Triagem</option>
                <option value={2}>Consulta</option>
              </select>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="form-group">

              <PesquisarEquipes
                especialidade={requestData.consulta.especialidade}
                onSelectEquipe={handleEquipeChange}
                equipeSelecionada={equipeSelecionada}
                onLimparEquipe={handleLimparEquipe}
              />
            </div>

            <div className="form-group checkbox-group">
              <label
                htmlFor="reservarSala"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  id="reservarSala"
                  checked={reservarSala}
                  onChange={handleReservarSalaChange}
                  style={{ display: 'none' }}
                />
                <span
                  className="checkmark"
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '1px solid #aaa',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    background: reservarSala ? '#e6f7e6' : 'var(--branco)',
                  }}
                >
                  {reservarSala ? '✔' : ''}
                </span>
                Reservar sala?
              </label>
            </div>

            {reservarSala && (
              <div className="form-group">
                <label htmlFor="sala">Sala</label>
                <SelectSala
                  id="sala"
                  especialidade={requestData.consulta.especialidade}
                  onSelectSala={(value) => handleStateChange('agendamento', 'salaId', value)}
                  selectedSala={requestData.agendamento.salaId}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="observacoes">Observações</label>
              <textarea
                id="observacoes"
                placeholder="Adicione observações relevantes..."
                value={requestData.consulta.observacao || ''}
                onChange={(e) => handleStateChange('consulta', 'observacao', e.target.value)}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (!isModalOpen) return null;

  return ReactDOM.createPortal(
    <div className="overlay" onClick={() => setIsModalOpen(false)}>
      <div className="agendar-modal" onClick={(e) => e.stopPropagation()}>
        <hgroup>
          <h3>Agendar Horário</h3>
          <div className="time-range">
            <span>{getDiaStringFromDateTime(requestData.agendamento.dataHoraInicio)}</span>
            <span>Início: {formatDateTimeToLocal(requestData.agendamento.dataHoraInicio)}</span>
            <span>Término: {formatDateTimeToLocal(requestData.agendamento.dataHoraFim)}</span>
          </div>
        </hgroup>

        <form onSubmit={(e) => e.preventDefault()}>
          {renderStep()}
        </form>

        <div className="step-buttons">
          {step > 1 && (
            <button type="button" onClick={() => setStep((prevStep) => prevStep - 1)}>
              Voltar
            </button>
          )}
          {step === 2 && (
            <button type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
          )}

          {step < 2 && (
            <button type="button" onClick={() => setStep((prevStep) => prevStep + 1)}>
              Avançar
            </button>
          )}

          {step === 2 && (
            <button onClick={handlePostAgendamento}>Salvar Agendamento</button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AgendamentoModal;