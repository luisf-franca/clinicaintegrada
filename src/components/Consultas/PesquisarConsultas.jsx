import React, { useState, useEffect } from 'react';

// FUNCTIONS
import GetConsultas from '../../functions/Consultas/GetConsultas';

const PesquisarConsultas = ({ setConsultas, especialidade }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [orderBy, setOrderBy] = useState('');
  const [nome, setNome] = useState('');

  const [status, setStatus] = useState(null);
  const [tipo, setTipo] = useState(null);

  useEffect(() => {
    if (nome === '') {
      getConsultas();
    }
  }, [nome, especialidade, status, tipo]);

  const getConsultas = async () => {
    try {
      const options = {};

      let filters = [];
      if (nome !== '') filters.push(`PacienteNome^${nome}`);
      if (especialidade) filters.push(`Especialidade=${especialidade}`);
      if (status) filters.push(`Status=${status}`);
      if (tipo) filters.push(`Tipo=${tipo}`);

      if (filters.length > 0) options.filter = filters.join(',');

      if (page) options.page = page;
      if (pageSize) options.pageSize = pageSize;
      if (orderBy) options.orderBy = orderBy;

      const response = await GetConsultas(options);
      setConsultas(response);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
    }
  };

  const handleNomeChange = (e) => {
    const { value } = e.target;
    setNome(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getConsultas();
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
                setConsultas([]);
              }}
            >
              Limpar
            </button>
          )}
          <h4>Status</h4>
          <select
            value={status || ''}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Todos</option>
            <option value={1}>Agendada</option>
            <option value={2}>Triagem</option>
            <option value={3}>Aguardando Consulta</option>
            <option value={4}>Em Andamento</option>
            <option value={5}>Concluída</option>
            <option value={6}>Cancelada</option>
          </select>

          <h4>Tipo</h4>
          <select value={tipo || ''} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Todas</option>
            <option value={1}>Triagens</option>
            <option value={2}>Consultas</option>
            {/* <option value={3}>Cancelado</option> */}
          </select>

          <button onClick={getConsultas}>Buscar</button>
        </div>
      </div>
    </div>
  );
};

export default PesquisarConsultas;
