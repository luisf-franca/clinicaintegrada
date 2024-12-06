import React, { useEffect, useState } from 'react';
import GetPacientes from '../../../functions/Pacientes/GetPacientes';

const PesquisarPacientes = ({ setPacientes }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [orderBy, setOrderBy] = useState('');
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (nome === '') {
      getPacientes(); // Chama a função de busca sem filtro quando `nome` estiver vazio
    }
  }, [nome]);

  const getPacientes = async () => {
    try {
      const options = {};

      // Constrói o filtro baseado nos valores preenchidos
      let filters = [];
      if (nome !== '') filters.push(`nome^${nome}`);

      // Concatena os filtros com vírgulas
      if (filters.length > 0) options.filter = filters.join(',');

      if (page) options.page = page;
      if (pageSize) options.pageSize = pageSize;
      if (orderBy) options.orderBy = orderBy;

      const response = await GetPacientes(options);
      setPacientes(response);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
    }
  };

  const handleNomeChange = (e) => {
    const { value } = e.target;
    setNome(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getPacientes();
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
            <button onClick={() => { clearFilter(); setPacientes([]); }}>Limpar</button>
          )}
        </div>
      </div>

      <button onClick={getPacientes}>Buscar Pacientes</button>
    </div>
  );
};

export default PesquisarPacientes;
