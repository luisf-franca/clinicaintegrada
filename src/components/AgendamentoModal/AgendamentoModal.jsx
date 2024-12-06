import React from 'react';
import './AgendamentoModal.css';

const AgendamentoModal = ({
  isModalOpen,
  setIsModalOpen,
  modalData,
  setModalData,
  handleSaveModal,
  currentRange,
}) => {
  return (
    isModalOpen && (
      <div className="overlay" onClick={() => setIsModalOpen(false)}>
        <div className="agendar-modal" onClick={(e) => e.stopPropagation()}>
          <hgroup>
            <h3>Fazer Agendamento</h3>
            <div className="time-range">
              <span>Início: {modalData.startSlot}</span>
              <span>Término: {modalData.endSlot}</span>
            </div>
          </hgroup>

          <input
            type="text"
            placeholder="Nome do Paciente"
            value={modalData.patientName}
            onChange={(e) =>
              setModalData({ ...modalData, patientName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Estagiários"
            value={modalData.interns}
            onChange={(e) =>
              setModalData({ ...modalData, interns: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Procedimento"
            value={modalData.procedure}
            onChange={(e) =>
              setModalData({ ...modalData, procedure: e.target.value })
            }
          />
          <textarea
            placeholder="Observações"
            value={modalData.observations}
            onChange={(e) =>
              setModalData({ ...modalData, observations: e.target.value })
            }
          />
          <button onClick={handleSaveModal}>Salvar</button>
          <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
        </div>
      </div>
    )
  );
};

export default AgendamentoModal;
