import React, { useState, useEffect } from 'react';
import '../styles/consulta.css';

// COMPONENTS
import Especialidade from '../components/Especialidade/Especialidade';
import PesquisarConsultas from '../components/Consultas/PesquisarConsultas';

// FUNCTIONS
import GetAgendamentoById from '../functions/Agendamentos/GetAgendamentoById';
import GetConsultaById from '../functions/Consultas/GetConsultaById';
import FormatarDateTimeToLocal from '../functions/FormatarDateTime/FormatDateTimeToLocal';

const Consulta = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    localStorage.getItem('selectedSpecialty') || 1,
  );
  const [registros, setRegistros] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState({});
  const [consultaSelecionada, setConsultaSelecionada] = useState({});

  useEffect(() => {
    const fetchAgendamento = async () => {
      try {
        const agendamento = await GetAgendamentoById(agendamentoSelecionado.id);
        setAgendamentoSelecionado(agendamento.data);
      } catch (error) {}
    };

    const fetchConsulta = async () => {
      try {
        const consulta = await GetConsultaById(consultaSelecionada.id);
        setConsultaSelecionada(consulta.data);
      } catch (error) {}
    };

    if (agendamentoSelecionado.id) fetchAgendamento();
    if (consultaSelecionada.id) fetchConsulta();
  }, [agendamentoSelecionado.id, consultaSelecionada.id]);

  const handleTabChange = (index) => setActiveTab(index);
  const handleAgendamentoClick = (agendamentoId, consultaId) => {
    setAgendamentoSelecionado({ id: agendamentoId });
    setConsultaSelecionada({ id: consultaId });
  };
  const tabList = [{ label: 'Lista' }, { label: 'Detalhes' }];

  return (
    <div className="consulta">
      <div className="consulta-hgroup">
        <h1>Consultas</h1>
        <Especialidade
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={setSelectedSpecialty}
        />
      </div>
      <nav className="consulta-nav">
        {tabList.map((tab, idx) => (
          <button
            key={tab.label}
            className={`btn-secondary${activeTab === idx ? ' active' : ''}`}
            onClick={() => setActiveTab(idx)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="consulta-content-wrapper">
        {activeTab === 0 && (
          <div className="consulta-list-card">
            <div className="search-container">
              <h4>Paciente</h4>
              <PesquisarConsultas
                setConsultas={setRegistros}
                especialidade={selectedSpecialty}
              />
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Observação</th>
                    <th>Data/Hora Início</th>
                    <th>Data/Hora Fim</th>
                    <th>Especialidade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((registro) => (
                    <tr
                      key={registro.id}
                      onClick={() =>
                        handleAgendamentoClick(
                          registro.agendamentoId,
                          registro.id,
                        )
                      }
                    >
                      <td>{registro.nome}</td>
                      <td>{registro.observacao}</td>
                      <td>
                        {FormatarDateTimeToLocal(registro.dataHoraInicio)}
                      </td>
                      <td>{FormatarDateTimeToLocal(registro.dataHoraFim)}</td>
                      <td>{registro.especialidade}</td>
                      <td>{registro.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 1 && (
          <div className="consulta-detalhes-card">
            {Object.keys(agendamentoSelecionado).length === 0 &&
            Object.keys(consultaSelecionada).length === 0 ? (
              <p>Selecione uma consulta na página anterior</p>
            ) : (
              <div className="consulta-detalhes-content">
                <div className="top-section"></div>
                <div className="name-section">
                  <div className="centered-content">
                    {agendamentoSelecionado.nome}
                  </div>
                </div>
                <div className="bottom-section">
                  <div className="left-column">
                    <h3>Agendamento</h3>
                    <div>
                      <p>
                        <strong>Data/Hora Início:</strong>{' '}
                        {FormatarDateTimeToLocal(
                          agendamentoSelecionado.dataHoraInicio,
                        )}
                      </p>
                      <p>
                        <strong>Data/Hora Fim:</strong>{' '}
                        {FormatarDateTimeToLocal(
                          agendamentoSelecionado.dataHoraFim,
                        )}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {agendamentoSelecionado.tipo}
                      </p>
                      <p>
                        <strong>Status:</strong> {agendamentoSelecionado.status}
                      </p>
                      <p>
                        <strong>Sala:</strong> {agendamentoSelecionado.sala}
                      </p>
                    </div>
                  </div>
                  <div className="right-column">
                    <h3>Consulta</h3>
                    <div>
                      <p>
                        <strong>Observação:</strong>{' '}
                        {consultaSelecionada.observacao}
                      </p>
                      <p>
                        <strong>Data/Hora Início:</strong>{' '}
                        {FormatarDateTimeToLocal(
                          consultaSelecionada.dataHoraInicio,
                        )}
                      </p>
                      <p>
                        <strong>Data/Hora Fim:</strong>{' '}
                        {FormatarDateTimeToLocal(
                          consultaSelecionada.dataHoraFim,
                        )}
                      </p>
                      <p>
                        <strong>Especialidade:</strong>{' '}
                        {consultaSelecionada.especialidade}
                      </p>
                      <p>
                        <strong>Status:</strong> {consultaSelecionada.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Consulta;
