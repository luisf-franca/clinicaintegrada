import React, { useState, useEffect, useCallback } from 'react';
import '../styles/salas.css';

// COMPONENTS
import PesquisarSalas from '../components/Salas/PesquisarSalas';
import AdicionarSala from '../components/Salas/AdicionarSala';
import AtualizarSala from '../components/Salas/AtualizarSala';

// FUNCTIONS
import GetSalas from '../functions/Salas/GetSalas';
import DeleteSala from '../functions/Salas/DeleteSala';

const Sala = () => {
  const [view, setView] = useState('list');
  const [salas, setSalas] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [totalCount, setTotalCount] = useState(0);
  const [filtros, setFiltros] = useState({ disponibilidade: '', especialidade: '' });

  const totalPages = Math.ceil(totalCount / pageSize);

  // Função para converter número do ENUM para string da API
  const getEspecialidadeString = (especialidadeEnum) => {
    const especialidadeMap = {
      '1': 'Psicologia',
      '2': 'Odontologia', 
      '3': 'Fisioterapia',
      '4': 'Nutricao'
    };
    return especialidadeMap[especialidadeEnum] || '';
  };

  const atualizarListaSalas = useCallback(
    async (pageToLoad, filtrosAtuais = filtros) => {
      setIsLoading(true);
      try {
        const options = { page: pageToLoad, pageSize };
        let filters = [];
        
        if (filtrosAtuais.especialidade && filtrosAtuais.especialidade.trim()) {
          const especialidadeString = getEspecialidadeString(filtrosAtuais.especialidade);
          if (especialidadeString) {
            filters.push(`especialidade=${especialidadeString}`);
          }
        }
        
        if (filtrosAtuais.disponibilidade && filtrosAtuais.disponibilidade.trim()) {
          filters.push(`isDisponivel=${filtrosAtuais.disponibilidade}`);
        }
        
        if (filters.length > 0) {
          options.filter = filters.join(',');
        }
        
        const response = await GetSalas(options);
        setSalas(response?.items || []);
        setTotalCount(response?.totalCount || 0);
      } catch (error) {
        console.error('Erro ao buscar salas:', error);
        setSalas([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize],
  );

  useEffect(() => {
    atualizarListaSalas(currentPage, filtros);
  }, [currentPage, atualizarListaSalas]);

  const handlePesquisar = useCallback((novosFiltros) => {
    setFiltros(novosFiltros);
    setCurrentPage(1);
    atualizarListaSalas(1, novosFiltros);
  }, [atualizarListaSalas]);

  const handleMudarPagina = (novaPagina) => {
    if (
      novaPagina >= 1 &&
      novaPagina <= Math.max(1, totalPages) &&
      novaPagina !== currentPage
    ) {
      setCurrentPage(novaPagina);
    }
  };

  const handleAdicionar = () => {
    setSalaSelecionada(null);
    setView('add');
  };

  const handleEditar = (sala) => {
    setSalaSelecionada(sala);
    setView('edit');
  };

  const handleDeletar = async (salaId) => {
    if (window.confirm('Tem certeza que deseja excluir esta sala?')) {
      try {
        await DeleteSala(salaId);
        atualizarListaSalas(currentPage, filtros);
      } catch (error) {
        console.error('Erro ao deletar sala:', error);
        alert('Erro ao deletar sala');
      }
    }
  };

  const handleVoltar = () => {
    setView('list');
    setSalaSelecionada(null);
    atualizarListaSalas(currentPage, filtros);
  };

  return (
    <div className="salas container">
      <div className="salas-hgroup">
        <h1>Salas</h1>
      </div>

      <nav className="salas-nav">
        <button
          className={`btn-secondary ${view === 'list' ? 'active' : ''}`}
          onClick={() => setView('list')}
        >
          Lista
        </button>
        <button
          className={`btn-secondary ${view === 'add' ? 'active' : ''}`}
          onClick={handleAdicionar}
        >
          Adicionar
        </button>
      </nav>

      <div className="salas-content-wrapper">
        {view === 'list' && (
          <div className="salas-list-card">
            <PesquisarSalas
              salas={salas}
              onPesquisar={handlePesquisar}
              onEditar={handleEditar}
              onDeletar={handleDeletar}
              currentPage={currentPage}
              totalPages={totalPages}
              onMudarPagina={handleMudarPagina}
              isLoading={isLoading}
            />
          </div>
        )}

        {view === 'add' && (
          <div className="salas-form-card">
            <AdicionarSala 
              onVoltar={handleVoltar} 
            />
          </div>
        )}

        {view === 'edit' && salaSelecionada && (
          <div className="salas-form-card">
            <AtualizarSala
              sala={salaSelecionada}
              onVoltar={handleVoltar}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sala;
