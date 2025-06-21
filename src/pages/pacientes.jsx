import React, { useState, useEffect, useCallback } from 'react';
import '../styles/pacientes.css';

// COMPONENTS
import PesquisarPacientes from '../components/Pacientes/PesquisarPacientes';
import AdicionarPaciente from '../components/Pacientes/AdicionarPaciente';
import AtualizarPaciente from '../components/Pacientes/AtualizarPaciente';

// FUNCTIONS
import GetPacientes from '../functions/Pacientes/GetPacientes';
import DeletePaciente from '../functions/Pacientes/DeletePaciente';

const Pacientes = () => {
  const [view, setView] = useState('list');
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);
  const [filtroNome, setFiltroNome] = useState('');

  const totalPages = Math.ceil(totalCount / pageSize);

  const atualizarListaPacientes = useCallback(
    async (pageToLoad, filtroAtual = filtroNome) => {
      setIsLoading(true);
      try {
        const options = { page: pageToLoad, pageSize };
        if (filtroAtual && filtroAtual.trim()) {
          options.filter = `nome^${filtroAtual}`;
        }
        const response = await GetPacientes(options);
        setPacientes(response?.items || []);
        setTotalCount(response?.totalCount || 0);
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        setPacientes([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize],
  );

  useEffect(() => {
    atualizarListaPacientes(currentPage, filtroNome);
  }, [currentPage, filtroNome, atualizarListaPacientes]);

  const handlePesquisar = useCallback((novoFiltro) => {
    setFiltroNome(novoFiltro);
    setCurrentPage(1);
  }, []); 

  const handleMudarPagina = (novaPagina) => {
    if (
      novaPagina >= 1 &&
      novaPagina <= Math.max(1, totalPages) &&
      novaPagina !== currentPage
    ) {
      setCurrentPage(novaPagina);
    }
  };

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
        if (pacienteSelecionado && pacienteSelecionado.id === pacienteId) {
          setView('list');
          setPacienteSelecionado(null);
        }

        // Recalcula se precisa voltar uma página
        const novaPagina = pacientes.length === 1 && currentPage > 1 
          ? currentPage - 1 
          : currentPage;
        
        setCurrentPage(novaPagina);
      } catch (error) {
        console.error('Erro ao deletar paciente:', error);
      }
    }
  };

  return (
    <div className="pacientes container">
      <div className="pacientes-hgroup">
        <h1>Pacientes</h1>
      </div>
      <nav className="pacientes-nav">
        <button
          className={`btn-secondary${view === 'list' ? ' active' : ''}`}
          onClick={() => setView('list')}
        >
          Pesquisar
        </button>
        <button
          className={`btn-secondary${view === 'add' ? ' active' : ''}`}
          onClick={() => setView('add')}
        >
          Adicionar
        </button>
        <button
          className={`btn-secondary${view === 'update' ? ' active' : ''}`}
          onClick={() => setView('update')}
        >
          Alterar
        </button>
      </nav>
      <div className="pacientes-content-wrapper">
        <div className="pacientes-form-card">
          {view === 'add' && (
            <AdicionarPaciente
              onSuccess={() => {
                setView('list');
                atualizarListaPacientes(currentPage, filtroNome);
              }}
            />
          )}
          {view === 'update' &&
            (pacienteSelecionado ? (
              <AtualizarPaciente
                pacienteInicial={pacienteSelecionado}
                onSuccess={() => {
                  setView('list');
                  setPacienteSelecionado(null);
                  atualizarListaPacientes(currentPage, filtroNome);
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
                <p style={{ color: 'var(--cinza)', marginTop: '1rem' }}>
                  Pesquise e selecione um paciente na lista ao lado para editar
                  as informações.
                </p>
              </div>
            ))}
          {view === 'list' && (
            <PesquisarPacientes onPesquisar={handlePesquisar} />
          )}
        </div>
        <div className="pacientes-list-card">
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
              ) : pacientes.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--cinza)' }}>
                    {filtroNome ? 'Nenhum paciente encontrado com esse nome.' : 'Nenhum paciente cadastrado.'}
                  </td>
                </tr>
              ) : (
                pacientes.map((paciente) => (
                  <tr
                    key={paciente.id}
                    className={
                      pacienteSelecionado?.id === paciente.id ? 'selected' : ''
                    }
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
                          e.stopPropagation();
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
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                className="btn-secondary"
                onClick={() => handleMudarPagina(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="btn-secondary"
                onClick={() => handleMudarPagina(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
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
