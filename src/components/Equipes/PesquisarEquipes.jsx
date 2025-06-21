import React, { useState, useEffect } from 'react';

// FUNCTIONS
import GetEquipes from '../../functions/Equipes/GetEquipes';

const PesquisarEquipes = ({ setEquipes, especialidade }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [orderBy, setOrderBy] = useState('');
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (nome === '') {
      getEquipes();
    }
  }, [nome, especialidade]);

  const getEquipes = async () => {
    try {
      const options = {};

      let filters = [];
      if (nome !== '') filters.push(`nome^${nome}`);
      if (especialidade !== '') filters.push(`especialidade=${especialidade}`);
      if (filters.length > 0) options.filter = filters.join(',');
      if (page) options.page = page;
      if (pageSize) options.pageSize = pageSize;
      if (orderBy) options.orderBy = orderBy;

      const response = await GetEquipes(options);
      setEquipes(response);
    } catch (error) {
      console.error('Erro ao buscar equipes:', error);
    }
  };

  const handleNomeChange = (e) => {
    const { value } = e.target;
    setNome(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getEquipes();
    }
  };

  const clearFilter = async () => {
    setNome('');
  };

  return (
    <div>
      <div>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={handleNomeChange}
            onKeyDown={handleKeyDown}
          />
          {nome && (
            <button
              onClick={() => {
                clearFilter();
                setEquipes([]);
              }}
            >
              Limpar
            </button>
          )}
          <button onClick={getEquipes}>Pesquisar</button>
        </div>
      </div>
    </div>
  );
};

export default PesquisarEquipes;
