import React, { useState, useEffect, useCallback } from 'react';
import '../styles/salas.css';

// COMPONENTS
import Especialidade from '../components/Especialidade/Especialidade';
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
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    localStorage.getItem('selectedSpecialty') || 1,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);
  const [filtroDisponibilidade, setFiltroDisponibilidade] = useState('');

  const totalPages = Math.ceil(totalCount / pageSize);

  const atualizarListaSalas = useCallback(
    async (pageToLoad, disponibilidadeAtual = filtroDisponibilidade) => {
      setIsLoading(true);
      try {
        const options = { page: pageToLoad, pageSize };
        let filters = [`especialidade=${selectedSpecialty}`];
        
        if (disponibilidadeAtual && disponibilidadeAtual.trim()) {
          filters.push(`disponibilidade=${disponibilidadeAtual}`);
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
    [pageSize, selectedSpecialty],
  );

  useEffect(() => {
    atualizarListaSalas(currentPage, filtroDisponibilidade);
  }, [currentPage, selectedSpecialty, atualizarListaSalas]);

  const handlePesquisar = useCallback((novaDisponibilidade) => {
    setFiltroDisponibilidade(novaDisponibilidade);
    setCurrentPage(1);
    atualizarListaSalas(1, novaDisponibilidade);
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
        atualizarListaSalas(currentPage, filtroDisponibilidade);
      } catch (error) {
        console.error('Erro ao deletar sala:', error);
        alert('Erro ao deletar sala');
      }
    }
  };

  const handleVoltar = () => {
    setView('list');
    setSalaSelecionada(null);
    atualizarListaSalas(currentPage, filtroDisponibilidade);
  };

  return (
    <div className="salas container">
      <div className="salas-hgroup">
        <h1>Salas</h1>
        <Especialidade
          selectedSpecialty={selectedSpecialty}
          setSelectedSpecialty={setSelectedSpecialty}
        />
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
              especialidade={selectedSpecialty}
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
