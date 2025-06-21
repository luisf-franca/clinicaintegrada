import React, { useState, useEffect, useCallback } from 'react';
import '../styles/listaespera.css';

// COMPONENTS
import Especialidade from '../components/Especialidade/Especialidade';
import PesquisarRegistros from '../components/ListaEspera/PesquisarRegistros';
import AdicionarRegistro from '../components/ListaEspera/AdicionarRegistro';
import AtualizarRegistro from '../components/ListaEspera/AtualizarRegistro';
import GetListaEntries from '../functions/ListaEspera/GetListaEntries';
import DeleteRegistro from '../functions/ListaEspera/DeleteListaEsperaEntry';

const ListaEspera = () => {
  const [selectedComponent, setSelectedComponent] = useState('Pesquisar');
  const [registros, setRegistros] = useState([]);
  const [registroSelecionado, setRegistroSelecionado] = useState({});
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    localStorage.getItem('selectedSpecialty') || 1,
  );
  const [filtros, setFiltros] = useState({
    nome: '',
    prioridade: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = Math.ceil(totalCount / pageSize);

  const atualizarRegistros = useCallback(
    async (pageToLoad = currentPage, filtrosAtuais = filtros) => {
      setIsLoading(true);
      try {
        const options = { page: pageToLoad, pageSize };
        let filters = [`especialidade=${selectedSpecialty}`];
        
        if (filtrosAtuais.nome && filtrosAtuais.nome.trim()) {
          filters.push(`PacienteNome^${filtrosAtuais.nome}`);
        }
        
        if (filtrosAtuais.prioridade && filtrosAtuais.prioridade.trim()) {
          filters.push(`prioridade=${filtrosAtuais.prioridade}`);
        }
        
        if (filtrosAtuais.status && filtrosAtuais.status.trim()) {
          filters.push(`status=${filtrosAtuais.status}`);
        }
        
        if (filters.length > 0) {
          options.filter = filters.join(',');
        }
        
        const response = await GetListaEntries(options);
        
        // Verifica se a resposta tem a estrutura esperada
        let registrosData = [];
        let totalCountData = 0;
        
        if (response && response.data && response.data.items) {
          registrosData = response.data.items;
          totalCountData = response.data.totalCount || 0;
        } else if (response && response.items) {
          registrosData = response.items;
          totalCountData = response.totalCount || 0;
        } else if (response && response.data && Array.isArray(response.data)) {
          registrosData = response.data;
          totalCountData = response.data.length;
        } else if (response && Array.isArray(response)) {
          registrosData = response;
          totalCountData = response.length;
        } else {
          registrosData = [];
          totalCountData = 0;
        }
        
        setRegistros(registrosData);
        setTotalCount(totalCountData);
      } catch (error) {
        console.error('Erro ao buscar registros:', error);
        setRegistros([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedSpecialty, pageSize, currentPage, filtros],
  );

  const handlePesquisar = useCallback((novosFiltros) => {
    setFiltros(novosFiltros);
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

  const handleRegistroClick = (registro) => {
    setRegistroSelecionado(registro);
    setSelectedComponent('Atualizar');
  };

  const handleDeleteRegistro = async (id) => {
    const confirmDelete = window.confirm(
      'Tem certeza que deseja deletar o registro?',
    );
    if (confirmDelete) {
      try {
        await DeleteRegistro(id);
        
        // Recalcula se precisa voltar uma página
        const novaPagina = registros.length === 1 && currentPage > 1 
          ? currentPage - 1 
          : currentPage;
        
        setCurrentPage(novaPagina);
        // A atualização será feita pelo useEffect quando currentPage mudar
      } catch (error) {
        console.error('Erro ao deletar registro:', error);
      }
    }
  };

  useEffect(() => {
    atualizarRegistros();
  }, [currentPage, selectedSpecialty, filtros]);

  return (
    <div className="listaespera container">
      <div className="listaespera-hgroup">
        <h1>Lista de Espera</h1>
        <Especialidade
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={setSelectedSpecialty}
        />
      </div>
      <nav className="listaespera-nav">
        <button
          className={`btn-secondary${
            selectedComponent === 'Pesquisar' ? ' active' : ''
          }`}
          onClick={() => setSelectedComponent('Pesquisar')}
        >
          Pesquisar
        </button>
        <button
          className={`btn-secondary${
            selectedComponent === 'Adicionar' ? ' active' : ''
          }`}
          onClick={() => setSelectedComponent('Adicionar')}
        >
          Adicionar
        </button>
        <button
          className={`btn-secondary${
            selectedComponent === 'Atualizar' ? ' active' : ''
          }`}
          onClick={() => setSelectedComponent('Atualizar')}
        >
          Atualizar
        </button>
      </nav>
      <div className="listaespera-content-wrapper">
        <div className="listaespera-form-card">
          {selectedComponent === 'Pesquisar' && (
            <PesquisarRegistros 
              onPesquisar={handlePesquisar}
              especialidade={selectedSpecialty}
            />
          )}
          {selectedComponent === 'Adicionar' && (
            <AdicionarRegistro
              atualizarRegistros={() => atualizarRegistros()}
              especialidade={selectedSpecialty}
            />
          )}
          {selectedComponent === 'Atualizar' && (
            <AtualizarRegistro
              registroId={registroSelecionado.id}
              registroInicial={registroSelecionado}
              atualizarRegistros={() => atualizarRegistros()}
            />
          )}
        </div>
        <div className="listaespera-list-card">
          <table className="pacientes-table">
            <thead className="header-lista">
              <tr>
                <th>Nome</th>
                <th>Data Entrada</th>
                <th>Data Saída</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Especialidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody className="body-lista">
              {isLoading ? (
                <tr>
                  <td colSpan="7">Carregando...</td>
                </tr>
              ) : registros.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--cinza)' }}>
                    {filtros.nome || filtros.prioridade || filtros.status ? 'Nenhum registro encontrado com os filtros aplicados.' : 'Nenhum registro encontrado.'}
                  </td>
                </tr>
              ) : (
                registros.map((registro) => (
                  <tr
                    key={registro.id}
                    className={
                      registroSelecionado.id === registro.id ? 'selected' : ''
                    }
                    onClick={() => handleRegistroClick(registro)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{registro.nome}</td>
                    <td>{new Date(registro.dataEntrada).toLocaleString()}</td>
                    <td>
                      {registro.dataSaida
                        ? new Date(registro.dataSaida).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td>{registro.status}</td>
                    <td>{registro.prioridade}</td>
                    <td>{registro.especialidade}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRegistro(registro.id);
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

export default ListaEspera;
