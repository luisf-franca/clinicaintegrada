import React, { useState, useEffect } from 'react';

// FUNCTIONS
import GetEquipes from '../../functions/Equipes/GetEquipes';

const PesquisarEquipes = ({ 
  especialidade, 
  onSelectEquipe, 
  equipeSelecionada,
  onLimparEquipe 
}) => {
  const [nome, setNome] = useState('');
  const [debouncedNome, setDebouncedNome] = useState('');
  const [equipes, setEquipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounce para evitar muitas requisições
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNome(nome);
    }, 300);

    return () => clearTimeout(timer);
  }, [nome]);

  // Busca equipes quando o nome debounced mudar ou quando o input recebe foco sem texto
  useEffect(() => {
    const buscarEquipes = async () => {
      if (!especialidade) {
        setEquipes([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const filters = [
          `especialidade=${especialidade}`
        ];

        // Se há texto digitado, adiciona filtro de nome
        if (debouncedNome.trim()) {
          filters.push(`nome^${debouncedNome}`);
        }

        const response = await GetEquipes({
          filter: filters.join(','),
          pageSize: debouncedNome.trim() ? 10 : 3 // 3 registros se não há texto, 10 se há
        });

        // A resposta já vem com a estrutura correta (response.data.data)
        const equipesData = response?.items || [];
        setEquipes(equipesData);
        setShowResults(true);
      } catch (error) {
        console.error('Erro ao buscar equipes:', error);
        setEquipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    buscarEquipes();
  }, [debouncedNome, especialidade]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNome(value);
    if (!value.trim()) {
      // Se não há texto, ainda mostra os 3 primeiros registros
      setShowResults(true);
    }
  };

  const handleSelectEquipe = (equipe) => {
    onSelectEquipe(equipe);
    setNome(equipe.nome);
    setShowResults(false);
  };

  const handleLimparEquipe = () => {
    onLimparEquipe();
    setNome('');
    setShowResults(false);
  };

  const handleInputFocus = () => {
    // Sempre mostra resultados quando recebe foco
    setShowResults(true);
  };

  const handleInputBlur = () => {
    // Delay para permitir clique nos resultados
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  return (
    <div className="pesquisar-equipes-form">
      <div className="form-group">
        <label htmlFor="nome-equipe">Nome da Equipe</label>
        <input
          id="nome-equipe"
          type="text"
          value={nome}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Digite o nome da equipe..."
          autoComplete="off"
          disabled={equipeSelecionada}
        />
        
        {equipeSelecionada && (
          <button
            type="button"
            onClick={handleLimparEquipe}
          >
            Limpar Equipe
          </button>
        )}
      </div>

      {showResults && (
        <div className="resultados-equipes">
          {isLoading ? (
            <div>Carregando...</div>
          ) : equipes.length === 0 ? (
            <div>Nenhuma equipe encontrada</div>
          ) : (
            equipes.map((equipe) => (
              <div
                key={equipe.id}
                onClick={() => handleSelectEquipe(equipe)}
              >
                <div>{equipe.nome}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PesquisarEquipes;
