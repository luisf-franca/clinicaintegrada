import React, { useState, useEffect, useCallback } from 'react';
import '../styles/equipes.css';

// COMPONENTS
import Especialidade from '../components/Especialidade/Especialidade';
import PesquisarEquipes from '../components/Equipes/PesquisarEquipes';
import AdicionarEquipe from '../components/Equipes/AdicionarEquipe';
import GerenciarEquipe from '../components/Equipes/GerenciarEquipe';

// FUNCTIONS
import GetEquipes from '../functions/Equipes/GetEquipes';
import DeleteEquipe from '../functions/Equipes/DeleteEquipe';

const Equipe = () => {
  const [view, setView] = useState('list');
  const [equipes, setEquipes] = useState([]);
  const [equipeSelecionada, setEquipeSelecionada] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    localStorage.getItem('selectedSpecialty') || 1,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / pageSize);

  const atualizarListaEquipes = useCallback(
    async (pageToLoad) => {
      setIsLoading(true);
      try {
        const options = { 
          page: pageToLoad, 
          pageSize,
          filter: `especialidade=${selectedSpecialty}`
        };
        
        const response = await GetEquipes(options);
        setEquipes(response?.items || []);
        setTotalCount(response?.totalCount || 0);
      } catch (error) {
        console.error('Erro ao buscar equipes:', error);
        setEquipes([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize, selectedSpecialty],
  );

  useEffect(() => {
    atualizarListaEquipes(currentPage);
  }, [currentPage, selectedSpecialty, atualizarListaEquipes]);

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
    setEquipeSelecionada(null);
    setView('add');
  };

  const handleGerenciar = (equipe) => {
    setEquipeSelecionada(equipe);
    setView('manage');
  };

  const handleDeletar = async (equipeId) => {
    if (window.confirm('Tem certeza que deseja excluir esta equipe?')) {
      try {
        await DeleteEquipe(equipeId);
        atualizarListaEquipes(currentPage);
      } catch (error) {
        console.error('Erro ao deletar equipe:', error);
        alert('Erro ao deletar equipe');
      }
    }
  };

  const handleVoltar = () => {
    setView('list');
    setEquipeSelecionada(null);
    setCurrentPage(1);
    atualizarListaEquipes(1);
  };

  return (
    <div className="equipes container">
      <div className="equipes-hgroup">
        <h1>Equipes</h1>
        <Especialidade
          selectedSpecialty={selectedSpecialty}
          setSelectedSpecialty={setSelectedSpecialty}
        />
      </div>

      <nav className="equipes-nav">
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

      <div className="equipes-content-wrapper">
        {view === 'list' && (
          <div className="equipes-list-card">
            <PesquisarEquipes
              equipes={equipes}
              onGerenciar={handleGerenciar}
              onDeletar={handleDeletar}
              currentPage={currentPage}
              totalPages={totalPages}
              onMudarPagina={handleMudarPagina}
              isLoading={isLoading}
            />
          </div>
        )}

        {view === 'add' && (
          <div className="equipes-form-card">
            <AdicionarEquipe 
              especialidade={selectedSpecialty}
              onVoltar={handleVoltar} 
            />
          </div>
        )}

        {view === 'manage' && equipeSelecionada && (
          <div className="equipes-form-card">
            <GerenciarEquipe
              equipe={equipeSelecionada}
              onVoltar={handleVoltar}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Equipe;
