import React, { useState, useEffect, useCallback } from 'react';
import '../styles/pacientes.css'; // Seu CSS atualizado

// COMPONENTS
import PesquisarPacientes from '../components/Pacientes/PesquisarPacientes';
import AdicionarPaciente from '../components/Pacientes/AdicionarPaciente';
import AtualizarPaciente from '../components/Pacientes/AtualizarPaciente';

// FUNCTIONS
import GetPacientes from '../functions/Pacientes/GetPacientes';
import DeletePaciente from '../functions/Pacientes/DeletePaciente';

const Pacientes = () => {
  const [view, setView] = useState('list'); // 'list', 'add', 'update'
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ======================= NOVOS ESTADOS PARA PAGINAÇÃO E FILTRO =======================
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7); // Pode ser ajustado conforme necessário
  const [totalCount, setTotalCount] = useState(0); // Total de itens no backend
  const [filtroNome, setFiltroNome] = useState(''); // Termo da busca

  // Este cálculo agora funcionará corretamente
  const totalPages = Math.ceil(totalCount / pageSize);

  const atualizarListaPacientes = useCallback(async (pageToLoad) => {
    setIsLoading(true);
    try {
      const options = {
        page: pageToLoad,
        pageSize: pageSize,
      };
      if (filtroNome) {
        options.filter = `nome^${filtroNome}`;
      }

      console.log(options);

      const response = await GetPacientes(options);

      // ======================= INÍCIO DA CORREÇÃO PRINCIPAL =======================
      // CORREÇÃO 1: Acessar 'response.items' em vez de 'response.data'
      setPacientes(response?.items || []);

      // Acessar 'response.totalCount' continua correto, então mantemos.
      setTotalCount(response?.totalCount || 0);
      // ======================== FIM DA CORREÇÃO PRINCIPAL =========================

    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      setPacientes([]);
      setTotalCount(0);
      alert('Falha ao carregar a lista de pacientes.');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, filtroNome]);

  useEffect(() => {
    atualizarListaPacientes(currentPage);
  }, [currentPage, atualizarListaPacientes]);

  const handlePesquisar = (novoFiltro) => {
    setFiltroNome(novoFiltro);
    setCurrentPage(1);
  };

  const handleMudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPages && novaPagina !== currentPage) {
      setCurrentPage(novaPagina);
    }
  };

  // ... Suas outras funções handlePacienteClick e handleDeletePaciente ...
  const handlePacienteClick = (paciente) => {
    setPacienteSelecionado(paciente);
    setView('update');
  };

  const handleDeletePaciente = async (pacienteId) => {
    const confirmDelete = window.confirm(
      'Tem certeza que deseja deletar? Todos os registros desse paciente serão perdidos.',
    );
    if (confirmDelete) {
      try {
        await DeletePaciente(pacienteId);
        alert('Paciente deletado com sucesso!');
        if (pacienteSelecionado && pacienteSelecionado.id === pacienteId) {
          setView('list');
          setPacienteSelecionado(null);
        }
        // Volta para a primeira página se o item deletado era o último da página atual
        if (pacientes.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          atualizarListaPacientes(currentPage);
        }
      } catch (error) {
        console.error('Erro ao deletar paciente:', error);
        alert('Erro ao deletar paciente.');
      }
    }
  };


  // Função para renderizar o painel lateral (formulário)
  const renderFormPanel = () => {
    switch (view) {
      case 'add':
        return <AdicionarPaciente onSuccess={() => { setView('list'); atualizarListaPacientes(); }} />;

      case 'update':
        // --- INÍCIO DA ALTERAÇÃO ---
        // Se a view for 'update', mas nenhum paciente estiver selecionado,
        // exiba uma mensagem em vez de renderizar o formulário.
        if (!pacienteSelecionado) {
          return (
            <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
              <p style={{ color: 'var(--cinza)', marginTop: '1rem' }}>
                Pesquise e Selecione um paciente na lista ao lado para editar as informações.
                👉
              </p>
            </div>
          );
        }
        // Se houver um paciente selecionado, renderize o formulário de atualização.
        return <AtualizarPaciente
          pacienteInicial={pacienteSelecionado}
          onSuccess={() => { setView('list'); setPacienteSelecionado(null); atualizarListaPacientes(); }}
        />;
      // --- FIM DA ALTERAÇÃO ---

      default: // 'list'
        return <PesquisarPacientes onPesquisar={handlePesquisar} />;
    }
  }

  return (
    <div className="pacientes">
      <div className="pacientes-header">
        <h2>Gestão de Pacientes</h2>
        <button className="btn-primary" onClick={() => setView('add')}>
          Adicionar Paciente
        </button>
      </div>

      <div className="pacientes-body">
        <div className="form-container">
          <div className="pacientes-actions">
            {/* Seus botões continuam aqui... */}
            <button className={`btn-secondary ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
              Pesquisar 🔎
            </button>
            <button className={`btn-secondary ${view === 'add' ? 'active' : ''}`} onClick={() => setView('add')}>
              Adicionar ➕
            </button>
            <button className={`btn-secondary ${view === 'update' ? 'active' : ''}`} onClick={() => setView('update')}>
              Alterar 🖊
            </button>
          </div>

          {/* Adicionamos um wrapper para o conteúdo do formulário */}
          <div className="form-content">
            {renderFormPanel()}
          </div>



        </div>

        <div className="lista-pacientes">
          <table className="pacientes-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Idade</th>
                <th>Alta</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5">Carregando...</td>
                </tr>
              ) : (
                pacientes.map((paciente) => (
                  <tr
                    key={paciente.id}
                    className={pacienteSelecionado?.id === paciente.id ? 'selected' : ''}
                    onClick={() => handlePacienteClick(paciente)}
                  >
                    <td>{paciente.nome}</td>
                    <td>{paciente.telefone}</td>
                    <td>{paciente.idade}</td>
                    <td>{paciente.recebeuAlta ? 'Sim' : 'Não'}</td>
                    <td>
                      <button
                        className="btn-danger"
                        onClick={(e) => {
                          e.stopPropagation(); // Impede que o onClick da <tr> seja disparado
                          handleDeletePaciente(paciente.id);
                        }}
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!isLoading && totalCount > 0 && (
            <div className="pagination-controls">
              <button
                className="btn-secondary"
                onClick={() => handleMudarPagina(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="btn-secondary"
                onClick={() => handleMudarPagina(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Próxima
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Pacientes;