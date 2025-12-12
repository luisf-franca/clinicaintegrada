import React, { useState, useEffect } from 'react';
import '../styles/consulta.css';
import { useLocation } from 'react-router-dom';

// COMPONENTS
import Especialidade from '../components/Especialidade/Especialidade';
import PesquisarConsultas from '../components/Consultas/PesquisarConsultas';
import CalendarFilter from '../components/Calendar/CalendarFilter.jsx';

// FUNCTIONS
import GetAgendamentoById from '../functions/Agendamentos/GetAgendamentoById';
import GetConsultaById from '../functions/Consultas/GetConsultaById';
import GetConsultas from '../functions/Consultas/GetConsultas';
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

  // --- ESTADOS DE DADOS E PAGINAÇÃO ---
  const [registros, setRegistros] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false); // [Adicionado] Igual PesquisarSalas

  const [activeTab, setActiveTab] = useState(0);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState({});
  const [consultaSelecionada, setConsultaSelecionada] = useState({});
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [filtrosAtuais, setFiltrosAtuais] = useState({});

  // ESTADOS DE CONTROLE
  const [dataSelecionada, setDataSelecionada] = useState(null);

  // Variável computada para total de páginas
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const consultaId = searchParams.get('consultaId');
    const tab = searchParams.get('tab');

    if (consultaId) {
      if (tab === '1' || !tab) {
        setActiveTab(1);
        handleAgendamentoClick(null, consultaId);
      }
    }
  }, [location.search]);

  const getStatusClass = (status) => {
    if (!status) return '';
    const statusMap = {
      'Agendada': 'agendada',
      'Triagem': 'triagem',
      'AguardandoConsulta': 'aguardando',
      'Aguardando Consulta': 'aguardando',
      'EmAndamento': 'em-andamento',
      'Em Andamento': 'em-andamento',
      'Concluída': 'concluida',
      'Concluida': 'concluida',
      'Cancelada': 'cancelada'
    };
    return statusMap[status] || '';
  };

  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return '-';
    return value;
  };

  const handleAtualizarLista = () => {
    fetchConsultas(currentPage, filtrosAtuais);
  };

  const formatDateForBackend = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // --- FETCH DADOS CORRIGIDO ---
  const fetchConsultas = async (page, filters = {}) => {
    setIsLoading(true); // Inicia loading
    try {
      const options = {
        page: page,
        pageSize: pageSize,
      };

      let filterStrings = [];

      if (filters.nome) filterStrings.push(`PacienteNome^${filters.nome}`);
      if (filters.status) filterStrings.push(`Status=${filters.status}`);
      if (filters.tipo) filterStrings.push(`Tipo=${filters.tipo}`);
      if (selectedSpecialty) filterStrings.push(`Especialidade=${selectedSpecialty}`);

      if (dataSelecionada) {
        const dataFormatada = formatDateForBackend(dataSelecionada);
        filterStrings.push(`DataAgendamento=${dataFormatada}`);
      }

      if (filterStrings.length > 0) {
        options.filter = filterStrings.join(',');
      }

      const response = await GetConsultas(options);

      // [CORREÇÃO] Verifica estrutura da resposta para extrair lista e total
      // Adapte 'data' ou 'items' conforme o retorno real do seu Back-end
      const lista = response.data || response.items || (Array.isArray(response) ? response : []);
      const total = response.totalCount || (Array.isArray(response) ? response.length : 0);

      setRegistros(lista);
      setTotalCount(total);

    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      setRegistros([]); // Garante lista vazia em erro
    } finally {
      setIsLoading(false); // Finaliza loading
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchConsultas(1, filtrosAtuais);
  }, [selectedSpecialty, dataSelecionada]);

  const handlePesquisar = (novosFiltros) => {
    setFiltrosAtuais(novosFiltros);
    setCurrentPage(1);
    fetchConsultas(1, novosFiltros);
  };

  // [CORREÇÃO] Lógica simplificada igual PesquisarSalas
  const handleMudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPages) {
      setCurrentPage(novaPagina);
      fetchConsultas(novaPagina, filtrosAtuais);
    }
  };

  const handleDateSelect = (date) => {
    setDataSelecionada(date);
  };

  const handleVoltarParaLista = () => {
    setAgendamentoSelecionado({});
    setConsultaSelecionada({});
    setSelectedRowId(null);
    setActiveTab(0);
  };

  const handleAgendamentoClick = async (agendamentoId, consultaId) => {
    setAgendamentoSelecionado({});
    setConsultaSelecionada({});
    setActiveTab(1);
    setSelectedRowId(consultaId);

    try {
      const consultaResponse = await GetConsultaById(consultaId);
      setConsultaSelecionada(consultaResponse.data);

      if (agendamentoId) {
        const agendamentoResponse = await GetAgendamentoById(agendamentoId);
        setAgendamentoSelecionado(agendamentoResponse.data);
      } else {
        setAgendamentoSelecionado({
          id: consultaResponse.data.agendamento?.id,
          nome: consultaResponse.data.paciente?.nome,
          dataHoraInicio: consultaResponse.data.agendamento?.dataHoraInicio,
          dataHoraFim: consultaResponse.data.agendamento?.dataHoraFim,
          tipo: consultaResponse.data.agendamento?.tipo,
          status: consultaResponse.data.status,
          sala: consultaResponse.data.sala || 'Não informada'
        });
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da consulta:', error);
    }
  };

  const renderAcoesDetalhes = () => {
    if (Object.keys(consultaSelecionada).length === 0) return null;

    const { status, tipo, id } = consultaSelecionada;

    if (tipo === 1) {
      if (status === 'Agendada') return <div className="acoes-container"><button className="btn-action btn-iniciar-triagem" onClick={(e) => handleAction(e, 'iniciar-triagem', id)}>Iniciar Triagem</button></div>;
      if (status === 'Triagem') return <div className="acoes-container"><button className="btn-action btn-finalizar-triagem" onClick={(e) => handleAction(e, 'finalizar-triagem', id)}>Finalizar Triagem</button></div>;
      if (status === 'AguardandoConsulta') return <div className="acoes-container"><button className="btn-action btn-iniciar-consulta" onClick={(e) => handleAction(e, 'iniciar-consulta', id)}>Iniciar Consulta</button></div>;
      if (status === 'EmAndamento') return <div className="acoes-container"><button className="btn-action btn-finalizar-consulta" onClick={(e) => handleAction(e, 'finalizar-consulta', id)}>Finalizar Consulta</button></div>;
    }
    if (tipo === 2) {
      if (status === 'Agendada') return <div className="acoes-container"><button className="btn-action btn-iniciar-consulta" onClick={(e) => handleAction(e, 'iniciar-consulta', id)}>Iniciar Consulta</button></div>;
      if (status === 'EmAndamento') return <div className="acoes-container"><button className="btn-action btn-finalizar-consulta" onClick={(e) => handleAction(e, 'finalizar-consulta', id)}>Finalizar Consulta</button></div>;
    }
    return null;
  };

  const handleAction = async (event, action, consultaId) => {
    event.stopPropagation();
    try {
      switch (action) {
        case 'iniciar-triagem': await IniciarTriagem(consultaId); break;
        case 'finalizar-triagem': await FinalizarTriagem(consultaId); break;
        case 'iniciar-consulta': await IniciarConsulta(consultaId); break;
        case 'finalizar-consulta': await FinalizarConsulta(consultaId); break;
        default: console.log(`Ação desconhecida: ${action}`); return;
      }

      if (selectedRowId === consultaId) {
        try {
          const [agendamentoResponse, consultaResponse] = await Promise.all([
            GetAgendamentoById(agendamentoSelecionado.id),
            GetConsultaById(consultaId),
          ]);
          setAgendamentoSelecionado(agendamentoResponse.data);
          setConsultaSelecionada(consultaResponse.data);
        } catch (error) {
          console.error('Erro ao recarregar dados:', error);
        }
      }
      handleAtualizarLista();
    } catch (error) {
      console.error(`Erro na ação ${action}:`, error);
      alert(`Erro ao processar ação. Tente novamente.`);
    }
  };

  return (
    <div className="consulta container">
      <div className="consulta-hgroup">
        <h1>Consultas</h1>
        <Especialidade
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={setSelectedSpecialty}
        />
      </div>

      <div className="consulta-content-wrapper">
        {activeTab === 0 && (
          <div className="consulta-dashboard-grid">
            <div className="consulta-sidebar">
              <CalendarFilter
                selectedDate={dataSelecionada}
                onDateSelect={handleDateSelect}
              />
              <div className="search-container">
                <PesquisarConsultas
                  onPesquisar={handlePesquisar}
                  especialidade={selectedSpecialty}
                  dataFiltro={dataSelecionada}
                />
              </div>
            </div>

            <div className="consulta-main-area">
              <div className="consulta-list-card">
                <div className="table-container">
                  {/* [ADICIONADO] Loading State igual PesquisarSalas */}
                  {isLoading ? (
                    <div className="loading-state">Carregando consultas...</div>
                  ) : (
                    <>
                      <table>
                        <thead>
                          <tr>
                            <th>Paciente</th>
                            <th>Data/Hora</th>
                            <th>Sala</th>
                            <th>Equipe</th>
                            <th>Especialidade</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registros.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="empty-state">Nenhuma consulta encontrada</td>
                            </tr>
                          ) : (
                            registros.map((registro) => (
                              <tr
                                key={registro.id}
                                onClick={() => handleAgendamentoClick(registro.agendamento?.id, registro.id)}
                                style={{ cursor: 'pointer' }}
                                className="clickable-row"
                              >
                                <td>{registro.paciente?.nome || '-'}</td>
                                <td>{FormatarDateTimeToLocal(registro.agendamento?.dataHoraInicio) || '-'}</td>
                                <td>{registro.sala?.nome || registro.sala || '-'}</td>
                                <td>{registro.equipe?.nome || registro.equipe || '-'}</td>
                                <td>{registro.especialidade?.nome || registro.especialidade || '-'}</td>
                                <td><span className={`status-badge ${getStatusClass(registro.status)}`}>{registro.status || '-'}</span></td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>

                      {/* [CORREÇÃO] Paginação renderizada condicionalmente igual PesquisarSalas */}
                      {totalPages > 1 && (
                        <div className="pagination">
                          <button
                            className="btn-pagination"
                            onClick={() => handleMudarPagina(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Anterior
                          </button>
                          <span className="page-info">
                            Página {currentPage} de {totalPages}
                          </span>
                          <button
                            className="btn-pagination"
                            onClick={() => handleMudarPagina(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Próximo
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MANTIVE O TAB 1 (DETALHES) INALTERADO POIS NÃO AFETA A PAGINAÇÃO */}
        {activeTab === 1 && (
          <div className="consulta-detalhes-view">
            <div className="detalhes-toolbar">
              <button className="btn-voltar" onClick={handleVoltarParaLista}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Voltar
              </button>
              {consultaSelecionada.status && (
                <span className={`status-badge large ${getStatusClass(consultaSelecionada.status)}`}>
                  {consultaSelecionada.status}
                </span>
              )}
            </div>

            <div className="consulta-detalhes-card animated-fade-in">
              {Object.keys(consultaSelecionada).length === 0 ? (
                <div className="loading-state">Carregando informações...</div>
              ) : (
                <div className="detalhes-grid">
                  <div className="detalhes-section full-width header-section">
                    <div className="patient-avatar-placeholder">
                      {consultaSelecionada.paciente?.nome?.charAt(0) || 'P'}
                    </div>
                    <div className="patient-info">
                      <h2>{renderValue(consultaSelecionada.paciente?.nome)}</h2>
                      <span className="meta-label">ID Paciente: {renderValue(consultaSelecionada.paciente?.id)}</span>
                    </div>
                    <div className="actions-wrapper">
                      {renderAcoesDetalhes()}
                    </div>
                  </div>

                  <hr className="divider full-width" />

                  <div className="detalhes-section">
                    <h3><span className="icon">📍</span> Logística e Local</h3>
                    <div className="info-row">
                      <div className="info-group">
                        <label>Sala</label>
                        <p>{renderValue(consultaSelecionada.sala?.nome)}</p>
                      </div>
                      <div className="info-group">
                        <label>Equipe Responsável</label>
                        <p>{renderValue(consultaSelecionada.equipe?.nome)}</p>
                      </div>
                      <div className="info-group">
                        <label>Especialidade</label>
                        <p>{renderValue(consultaSelecionada.especialidade)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="detalhes-section">
                    <h3><span className="icon">📅</span> Cronologia</h3>
                    <div className="info-grid-2">
                      <div className="info-card">
                        <label>Agendado para (Previsão)</label>
                        <p className="highlight-date">
                          {FormatarDateTimeToLocal(consultaSelecionada.agendamento?.dataHoraInicio)}
                        </p>
                        <small>Tipo: {renderValue(consultaSelecionada.agendamento?.tipo)}</small>
                      </div>
                      <div className="info-card">
                        <label>Execução Real</label>
                        <div className="mini-row">
                          <span>Início:</span>
                          <strong>{renderValue(FormatarDateTimeToLocal(consultaSelecionada.dataHoraInicio))}</strong>
                        </div>
                        <div className="mini-row">
                          <span>Fim:</span>
                          <strong>{renderValue(FormatarDateTimeToLocal(consultaSelecionada.dataHoraFim))}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="detalhes-section full-width">
                    <h3><span className="icon">📝</span> Observações e Prontuário</h3>
                    <div className="textarea-wrapper">
                      <textarea
                        readOnly
                        value={consultaSelecionada.observacao || ''}
                        placeholder="Nenhuma observação registrada para esta consulta."
                        className="styled-textarea"
                        rows={5}
                      />
                    </div>
                  </div>

                  <div className="detalhes-footer full-width">
                    <small>ID da Consulta: {consultaSelecionada.id}</small>
                    <small>ID do Agendamento Original: {consultaSelecionada.agendamento?.id}</small>
                  </div>

                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consulta;