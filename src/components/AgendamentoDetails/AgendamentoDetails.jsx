import React from 'react';
import './AgendamentoDetails.css';

const AgendamentoDetails = ({ modalData, closeDetails }) => {
  return (
    <div className="details-overlay" onClick={closeDetails}>
      <div className="agendamento-details" onClick={(e) => e.stopPropagation()}>
        <h3>Detalhes do Agendamento</h3>
        <div className="details-info">
          <div>
            <strong>Nome do Paciente:</strong> {modalData.patientName}
          </div>
          <div>
            <strong>Estagiários:</strong> {modalData.interns}
          </div>
          <div>
            <strong>Procedimento:</strong> {modalData.procedure}
          </div>
          <div>
            <strong>Observações:</strong> {modalData.observations}
          </div>
          <div>
            <strong>Início:</strong> {modalData.startSlot}
          </div>
          <div>
            <strong>Término:</strong> {modalData.endSlot}
          </div>
        </div>
        <button onClick={closeDetails}>Fechar</button>
      </div>
    </div>
  );
};

export default AgendamentoDetails;
