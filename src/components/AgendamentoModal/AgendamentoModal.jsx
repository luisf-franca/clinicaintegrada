import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './AgendamentoModal.css';

// COMPONENTS
import PesquisarListaEspera from '../ListaEspera/PesquisarListaEspera';
import PesquisarEquipes from '../Equipes/PesquisarEquipes';
import SelectSala from '../Salas/SelectSala';
import Especialidade from '../Especialidade/Especialidade';
import CriarPacienteAgendamento from '../Pacientes/CriarPacienteAgendamento'; // Novo componente

// FUNCTIONS
import CreateAgendamento from '../../functions/Agendamentos/CreateAgendamento';

const AgendamentoModal = ({
  isModalOpen,
  setIsModalOpen,
  modalData,
  atualizarRegistros,
}) => {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState('search'); // 'search' ou 'create-patient'

  // Dados de Seleção (Separados para Feedback Visual)
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [equipeSelecionada, setEquipeSelecionada] = useState(null);

  // Estado do Formulário
  const [reservarSala, setReservarSala] = useState(!!modalData.salaId);
  const [requestData, setRequestData] = useState({
    agendamento: {
      dataHoraInicio: modalData.startSlot,
      dataHoraFim: modalData.endSlot,
      tipo: 1, // 1: Triagem, 2: Consulta
      status: 1,
      pacienteId: modalData.pacienteId || null,
      nomePaciente: '', // Caso seja avulso sem ID (legado, mas mantemos)
      salaId: modalData.salaId || null,
    },
    consulta: {
      observacao: '',
      especialidade: localStorage.getItem('selectedSpecialty') || 1,
      equipeId: '',
    },
  });

  // Helpers de Data
  const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // --- Handlers de Paciente ---

  const handlePacienteSelect = (registro) => {
    // registro vem da Lista de Espera
    setPacienteSelecionado({
      id: registro.pacienteId || registro.id,
      nome: registro.nome || registro.pacienteNome,
      origem: 'Lista de Espera'
    });

    setRequestData(prev => ({
      ...prev,
      agendamento: { ...prev.agendamento, pacienteId: registro.pacienteId || registro.id }
    }));
  };

  const handlePacienteCriado = (novoPaciente) => {
    // Callback ajustado para receber os dados mapeados do filho
    console.log("Paciente criado recebido:", novoPaciente); // Debug útil

    setPacienteSelecionado({
      id: novoPaciente.id,
      nome: novoPaciente.nome,
      origem: 'Novo Cadastro'
    });

    setRequestData(prev => ({
      ...prev,
      agendamento: {
        ...prev.agendamento,
        pacienteId: novoPaciente.id // Garante o uso do ID retornado pela API
      }
    }));

    setMode('search'); // Volta para visualização normal
  };

  const handleRemoverPaciente = () => {
    setPacienteSelecionado(null);
    setRequestData(prev => ({
      ...prev,
      agendamento: { ...prev.agendamento, pacienteId: null }
    }));
  };

  // --- Handlers de Equipe ---

  const handleEquipeSelect = (equipe) => {
    setEquipeSelecionada(equipe);
    setRequestData(prev => ({
      ...prev,
      consulta: { ...prev.consulta, equipeId: equipe.id }
    }));
  };

  // --- Submissão ---

  const handleSalvar = async () => {
    try {
      if (!requestData.consulta.equipeId) {
        alert("A seleção da equipe é obrigatória.");
        return;
      }

      const payload = {
        ...requestData,
        agendamento: {
          ...requestData.agendamento,
          tipo: parseInt(requestData.agendamento.tipo, 10),
          pacienteId: requestData.agendamento.pacienteId || null,
        },
        consulta: {
          ...requestData.consulta,
          especialidade: parseInt(requestData.consulta.especialidade, 10),
        }
      };

      console.log("Payload enviado para agendamento:", payload);
      await CreateAgendamento(payload);
      atualizarRegistros();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("A sala atingiu sua capacidade máxima.");
    }
  };

  if (!isModalOpen) return null;

  return ReactDOM.createPortal(
    <div className="overlay" onClick={() => setIsModalOpen(false)}>
      <div className="agendar-modal" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="modal-header">
          <h3>Agendar Horário</h3>
          <div className="time-badge">
            <strong>📅 {formatDate(requestData.agendamento.dataHoraInicio)}</strong>
            <span>🕒 {formatTime(requestData.agendamento.dataHoraInicio)} - {formatTime(requestData.agendamento.dataHoraFim)}</span>
          </div>
        </div>

        {/* BODY */}
        <div className="modal-body">

          {/* ETAPA 1: Definições Básicas e Paciente */}
          {step === 1 && (
            <div className="form-section">
              <span className="step-indicator">PASSO 1 DE 2: DADOS DO PACIENTE</span>

              <div className="form-group">
                <label>Especialidade</label>
                <Especialidade
                  selectedSpecialty={requestData.consulta.especialidade}
                  onSelectSpecialty={(val) => setRequestData(p => ({ ...p, consulta: { ...p.consulta, especialidade: val } }))}
                />
              </div>

              <div className="form-group">
                <label>Tipo de Atendimento</label>
                <select
                  value={requestData.agendamento.tipo}
                  onChange={(e) => setRequestData(p => ({ ...p, agendamento: { ...p.agendamento, tipo: e.target.value } }))}
                >
                  <option value={1}>Triagem</option>
                  <option value={2}>Consulta / Retorno</option>
                </select>
              </div>

              <div className="form-group">
                {/* <label>Paciente</label> */}

                {/* Lógica de Visualização do Paciente */}
                {pacienteSelecionado ? (
                  // ESTADO 1: Paciente Selecionado (Card Visual)
                  <div className="selection-card success">
                    <div className="selection-info">
                      <strong>{pacienteSelecionado.nome}</strong>
                      <span>Status: {pacienteSelecionado.origem}</span>
                    </div>
                    <button className="btn-remove" onClick={handleRemoverPaciente}>
                      Alterar
                    </button>
                  </div>
                ) : mode === 'create-patient' ? (
                  // ESTADO 2: Criando Novo Paciente
                  <CriarPacienteAgendamento
                    onPacienteCriado={handlePacienteCriado}
                    onCancelar={() => setMode('search')}
                    especialidadeId={requestData.consulta.especialidade}
                  />
                ) : (
                  // ESTADO 3: Buscando na Lista de Espera
                  <>
                    <PesquisarListaEspera
                      especialidade={requestData.consulta.especialidade}
                      onSelectRegistro={handlePacienteSelect}
                    // Adicionamos um texto de ajuda visual no componente pai
                    />
                    <p className="input-helper-text">
                      * Buscando registros ativos na Lista de Espera.
                    </p>

                    <button className="btn-create-new" onClick={() => setMode('create-patient')}>
                      + Paciente não está na lista? Cadastrar Novo
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ETAPA 2: Equipe e Sala */}
          {step === 2 && (
            <div className="form-section">
              <span className="step-indicator">PASSO 2 DE 2: EQUIPE E SALA</span>

              <div className="form-group">
                {/* <label>Equipe Responsável <span style={{ color: 'red' }}>*</span></label> */}
                {equipeSelecionada ? (
                  <div className="selection-card success">
                    <div className="selection-info">
                      <strong>{equipeSelecionada.nome}</strong>
                      <span>Equipe Selecionada</span>
                    </div>
                    <button className="btn-remove" onClick={() => setEquipeSelecionada(null)}>
                      Alterar
                    </button>
                  </div>
                ) : (
                  <PesquisarEquipes
                    especialidade={requestData.consulta.especialidade}
                    onSelectEquipe={handleEquipeSelect}
                  />
                )}
              </div>

              <div className="form-group checkbox-group">
                <label className="custom-checkbox-label">
                  <input
                    type="checkbox"
                    checked={reservarSala}
                    onChange={(e) => {
                      setReservarSala(e.target.checked);
                      if (!e.target.checked) setRequestData(p => ({ ...p, agendamento: { ...p.agendamento, salaId: null } }));
                    }}
                    hidden // Oculta o input nativo
                  />
                  {/* Caixa visual do Checkbox */}
                  <div className={`custom-checkbox-box ${reservarSala ? 'checked' : ''}`}>
                    {reservarSala && <span className="checkmark-icon">✔️</span>}
                  </div>
                  <span>Reservar sala?</span>
                </label>
              </div>

              {reservarSala && (
                <div className="form-group">
                  <label>Sala</label>
                  <SelectSala
                    initialSala={modalData.salaObj || { id: null, nome: 'Selecione uma sala...' }}
                    selectedSala={requestData.agendamento.salaId}
                    onSelectSala={(val) => setRequestData(p => ({ ...p, agendamento: { ...p.agendamento, salaId: val } }))}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Observações</label>
                <textarea
                  placeholder="Detalhes para a equipe..."
                  value={requestData.consulta.observacao}
                  onChange={(e) => setRequestData(p => ({ ...p, consulta: { ...p.consulta, observacao: e.target.value } }))}
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          {step === 1 ? (
            <>
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className="btn-primary" onClick={() => setStep(2)}>
                {pacienteSelecionado ? 'Avançar' : 'Agendar sem paciente'} &rarr;
              </button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => setStep(1)}>&larr; Voltar</button>
              <button
                className="btn-primary"
                onClick={handleSalvar}
                disabled={!equipeSelecionada}
                title={!equipeSelecionada ? "Selecione uma equipe para concluir" : ""}
              >
                Confirmar Agendamento
              </button>
            </>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
};

export default AgendamentoModal;