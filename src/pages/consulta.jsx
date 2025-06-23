import React, { useState, useEffect } from 'react';
import '../styles/consulta.css';
import { useLocation } from 'react-router-dom';

// COMPONENTS
import Especialidade from '../components/Especialidade/Especialidade';
import PesquisarConsultas from '../components/Consultas/PesquisarConsultas';

// FUNCTIONS
import GetAgendamentoById from '../functions/Agendamentos/GetAgendamentoById';
import GetConsultaById from '../functions/Consultas/GetConsultaById';
import FormatarDateTimeToLocal from '../functions/FormatarDateTime/FormatDateTimeToLocal';
import IniciarTriagem from '../functions/Consultas/IniciarTriagem';
import FinalizarTriagem from '../functions/Consultas/FinalizarTriagem';
import IniciarConsulta from '../functions/Consultas/IniciarConsulta';
import FinalizarConsulta from '../functions/Consultas/FinalizarConsulta';

const Consulta = () => {
  const location = useLocation();
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    localStorage.getItem('selectedSpecialty') || 1,
  );
  const [registros, setRegistros] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState({});
  const [consultaSelecionada, setConsultaSelecionada] = useState({});
  const [selectedRowId, setSelectedRowId] = useState(null);
  // --- [NOVO] ESTADO PARA FORÇAR A ATUALIZAÇÃO DA LISTA ---
  const [atualizarLista, setAtualizarLista] = useState(false);

  // --- [NOVO] DETECTAR PARÂMETROS DA URL ---
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const consultaId = searchParams.get('consultaId');
    const tab = searchParams.get('tab');

    if (consultaId && tab === '1') {
      setActiveTab(1);
      handleAgendamentoClick(null, consultaId);
    }
  }, [location.search]);

  // Função para alternar o estado e disparar a atualização
  const handleAtualizarLista = () => {
    setAtualizarLista(prev => !prev);
  };

  const handleTabChange = (index) => {
    if (index === 0) {
      setAgendamentoSelecionado({});
      setConsultaSelecionada({});
      setSelectedRowId(null);
    }
    setActiveTab(index);
  };

  const handleAgendamentoClick = async (agendamentoId, consultaId) => {
    setAgendamentoSelecionado({});
    setConsultaSelecionada({});
    setActiveTab(1);
    setSelectedRowId(consultaId);

    try {
      const consultaResponse = await GetConsultaById(consultaId);
      setConsultaSelecionada(consultaResponse.data);
      
      // Se temos o agendamentoId, buscar os dados do agendamento
      if (agendamentoId) {
        const agendamentoResponse = await GetAgendamentoById(agendamentoId);
        setAgendamentoSelecionado(agendamentoResponse.data);
      } else {
        // Se não temos o agendamentoId, usar os dados do agendamento da consulta
        setAgendamentoSelecionado({
          id: consultaResponse.data.agendamentoId,
          nome: consultaResponse.data.nome,
          dataHoraInicio: consultaResponse.data.dataHoraInicio,
          dataHoraFim: consultaResponse.data.dataHoraFim,
          tipo: consultaResponse.data.tipo,
          status: consultaResponse.data.status,
          sala: consultaResponse.data.sala || 'Não informada'
        });
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da consulta:', error);
    }
  };

  // --- [NOVO] FUNÇÃO PARA RENDERIZAR AÇÕES NA ABA DE DETALHES ---
  const renderAcoesDetalhes = () => {
    if (Object.keys(consultaSelecionada).length === 0) {
      return null;
    }

    const { status, tipo, id } = consultaSelecionada;

    // Para consultas tipo 1 (com triagem)
    if (tipo === 1) {
      if (status === 'Agendada') {
        return (
          <div className="acoes-container">
            <button className="btn-action btn-iniciar-triagem" onClick={(e) => handleAction(e, 'iniciar-triagem', id)}>
              Iniciar Triagem
            </button>
          </div>
        );
      }

      if (status === 'Triagem') {
        return (
          <div className="acoes-container">
            <button className="btn-action btn-finalizar-triagem" onClick={(e) => handleAction(e, 'finalizar-triagem', id)}>
              Finalizar Triagem
            </button>
          </div>
        );
      }

      if (status === 'AguardandoConsulta') {
        return (
          <div className="acoes-container">
            <button className="btn-action btn-iniciar-consulta" onClick={(e) => handleAction(e, 'iniciar-consulta', id)}>
              Iniciar Consulta
            </button>
          </div>
        );
      }

      if (status === 'EmAndamento') {
        return (
          <div className="acoes-container">
            <button className="btn-action btn-finalizar-consulta" onClick={(e) => handleAction(e, 'finalizar-consulta', id)}>
              Finalizar Consulta
            </button>
          </div>
        );
      }
    }

    // Para consultas tipo 2 (sem triagem)
    if (tipo === 2) {
      if (status === 'Agendada') {
        return (
          <div className="acoes-container">
            <button className="btn-action btn-iniciar-consulta" onClick={(e) => handleAction(e, 'iniciar-consulta', id)}>
              Iniciar Consulta
            </button>
          </div>
        );
      }

      if (status === 'EmAndamento') {
        return (
          <div className="acoes-container">
            <button className="btn-action btn-finalizar-consulta" onClick={(e) => handleAction(e, 'finalizar-consulta', id)}>
              Finalizar Consulta
            </button>
          </div>
        );
      }
    }

    // Nenhuma ação para status 'Concluída', 'Cancelada', etc.
    return null;
  };

  // --- [NOVO] FUNÇÃO PARA LIDAR COM AS AÇÕES DOS BOTÕES ---
  const handleAction = async (event, action, consultaId) => {
    event.stopPropagation(); // Impede que o onClick da linha (abrir detalhes) seja acionado

    try {
      switch (action) {
        case 'iniciar-triagem':
          await IniciarTriagem(consultaId);
          break;
        case 'finalizar-triagem':
          await FinalizarTriagem(consultaId);
          break;
        case 'iniciar-consulta':
          await IniciarConsulta(consultaId);
          break;
        case 'finalizar-consulta':
          await FinalizarConsulta(consultaId);
          break;
        default:
          console.log(`Ação desconhecida: ${action}`);
          return;
      }
      
      // --- [NOVO] RECARREGAR DADOS DA CONSULTA SELECIONADA ---
      if (selectedRowId === consultaId) {
        try {
          const [agendamentoResponse, consultaResponse] = await Promise.all([
            GetAgendamentoById(agendamentoSelecionado.id),
            GetConsultaById(consultaId),
          ]);
          setAgendamentoSelecionado(agendamentoResponse.data);
          setConsultaSelecionada(consultaResponse.data);
        } catch (error) {
          console.error('Erro ao recarregar dados da consulta:', error);
        }
      }
      
      handleAtualizarLista(); // Atualiza a lista após qualquer ação bem-sucedida
    } catch (error) {
      console.error(`Erro ao executar a ação ${action}:`, error);
      alert(`Ocorreu um erro ao ${action.replace('-', ' ')}. Tente novamente.`);
    }
  };

  const tabList = [{ label: 'Lista' }, { label: 'Detalhes' }];

  return (
    <div className="consulta container">
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
            onClick={() => handleTabChange(idx)}
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
                // --- [MODIFICADO] Passa o estado para o componente de pesquisa ---
                atualizar={atualizarLista}
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
                      // O onClick na linha inteira ainda leva para os detalhes
                      onClick={() =>
                        handleAgendamentoClick(
                          registro.agendamentoId,
                          registro.id,
                        )
                      }
                      // Adicionar um cursor para indicar que a linha é clicável
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{registro.nome}</td>
                      <td>{registro.observacao}</td>
                      <td>{FormatarDateTimeToLocal(registro.dataHoraInicio)}</td>
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
                {/* --- [NOVO] SEÇÃO DE AÇÕES ANTES DAS INFORMAÇÕES --- */}
                <div className="acoes-section">
                  {renderAcoesDetalhes()}
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
