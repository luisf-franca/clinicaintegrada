import React, { useState, useEffect, useCallback } from 'react';
import '../styles/profissionais.css';

// COMPONENTS
import PesquisarProfissionais from '../components/Profissionais/PesquisarProfissionais';
import AdicionarProfissional from '../components/Profissionais/AdicionarProfissional';
import AtualizarProfissional from '../components/Profissionais/AtualizarProfissional';

// FUNCTIONS
import GetProfissionais from '../functions/Profissionais/GetProfissionais';
import DeleteProfissional from '../functions/Profissionais/DeleteProfissional';

const Profissionais = () => {
  const [view, setView] = useState('list');
  const [profissionais, setProfissionais] = useState([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);
  const [filtros, setFiltros] = useState({
    nome: '',
    tipo: '',
    especialidade: ''
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  const atualizarListaProfissionais = useCallback(
    async (pageToLoad, filtrosAtuais = filtros) => {
      setIsLoading(true);
      try {
        const options = { page: pageToLoad, pageSize };
        let filters = [];
        
        if (filtrosAtuais.nome && filtrosAtuais.nome.trim()) {
          filters.push(`nome^${filtrosAtuais.nome}`);
        }
        
        if (filtrosAtuais.tipo && filtrosAtuais.tipo.trim()) {
          filters.push(`tipo=${filtrosAtuais.tipo}`);
        }
        
        if (filtrosAtuais.especialidade && filtrosAtuais.especialidade.trim()) {
          filters.push(`especialidade=${filtrosAtuais.especialidade}`);
        }
        
        if (filters.length > 0) {
          options.filter = filters.join(',');
        }
        
        const response = await GetProfissionais(options);
        setProfissionais(response?.items || []);
        setTotalCount(response?.totalCount || 0);
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
        setProfissionais([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize],
  );

  useEffect(() => {
    atualizarListaProfissionais(currentPage, filtros);
  }, [currentPage, atualizarListaProfissionais]);

  const handlePesquisar = useCallback((novosFiltros) => {
    setFiltros(novosFiltros);
    setCurrentPage(1);
    atualizarListaProfissionais(1, novosFiltros);
  }, [atualizarListaProfissionais]);

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
    setProfissionalSelecionado(null);
    setView('add');
  };

  const handleEditar = (profissional) => {
    setProfissionalSelecionado(profissional);
    setView('edit');
  };

  const handleDeletar = async (profissionalId) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
      try {
        await DeleteProfissional(profissionalId);
        atualizarListaProfissionais(currentPage, filtros);
      } catch (error) {
        console.error('Erro ao deletar profissional:', error);
        alert('Erro ao deletar profissional');
      }
    }
  };

  const handleVoltar = () => {
    setView('list');
    setProfissionalSelecionado(null);
    atualizarListaProfissionais(currentPage, filtros);
  };

  return (
    <div className="profissionais container">
      <div className="profissionais-hgroup">
        <h1>Profissionais</h1>
      </div>

      <nav className="profissionais-nav">
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

      <div className="profissionais-content-wrapper">
        {view === 'list' && (
          <div className="profissionais-list-card">
            <PesquisarProfissionais
              profissionais={profissionais}
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
          <div className="profissionais-form-card">
            <AdicionarProfissional onVoltar={handleVoltar} />
          </div>
        )}

        {view === 'edit' && profissionalSelecionado && (
          <div className="profissionais-form-card">
            <AtualizarProfissional
              profissional={profissionalSelecionado}
              onVoltar={handleVoltar}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profissionais;
