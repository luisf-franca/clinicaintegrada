import React, { useState, useEffect } from 'react';
import './PesquisarRegistros.css';

// COMPONENTS
import GetListaEntries from '../../functions/ListaEspera/GetListaEntries';

const PesquisarRegistros = ({ setRegistros, especialidade }) => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5); // Limite para dropdown
  const [orderBy, setOrderBy] = useState('dataEntrada');
  const [nome, setNome] = useState('');

  const [prioridade, setPrioridade] = useState(null);
  const [status, setStatus] = useState(1);

  useEffect(() => {
    if (nome === '') {
      getRegistrosListaEspera(); // Chama a função de busca sem filtro quando `nome` estiver vazio
    }
  }, [nome]);

  useEffect(() => {
    getRegistrosListaEspera();
  }
    , [especialidade, prioridade, status]);

  const getRegistrosListaEspera = async () => {
    try {
      const options = {};

      // Constrói o filtro baseado nos valores preenchidos
      let filters = [`especialidade=${especialidade}`];
      if (nome !== '') filters.push(`PacienteNome^${nome}`);
      if (prioridade) filters.push(`prioridade=${prioridade}`);
      if (status) filters.push(`status=${status}`);

      // Concatena os filtros com vírgulas
      if (filters.length > 0) options.filter = filters.join(',');

      if (page) options.page = page;
      if (pageSize) options.pageSize = pageSize;
      if (orderBy) options.orderBy = orderBy;

      const response = await GetListaEntries(options);
      setRegistros(response);
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
    }
  }

  const handleNomeChange = (e) => {
    setNome(e.target.value); // Atualiza o estado do nome
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getRegistrosListaEspera();
    }
  };

  const clearFilter = () => {
    setNome(''); // Limpa o filtro
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
                setRegistros([]);
              }}
            >
              Limpar
            </button>
          )}
          <label>Prioridade:
            <select value={prioridade || ''} onChange={(e) => setPrioridade(e.target.value)}>
              <option value="">Todas</option>
              <option value={1}>Baixa</option>
              <option value={2}>Média</option>
              <option value={3}>Alta</option>
            </select>
          </label>

          <label>Status:
            <select value={status || ''} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Todas</option>
              <option value={1}>Aguardando</option>
              <option value={2}>Atendido</option>
              <option value={3}>Cancelado</option>
            </select>
          </label>
        </div>
      </div>

      <button onClick={getRegistrosListaEspera}>Pesquisar</button>
    </div>

  );
};

export default PesquisarRegistros;
