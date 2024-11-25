import React, { useState } from 'react';
import '../PatientCard/patientCard.css';
import GetPacientes from '../../functions/Pacientes/GetPacientes';

const PesquisarPacientes = ({ setPacientes }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [filter, setFilter] = useState('');
  const [orderBy, setOrderBy] = useState('');

  const getPacientes = async () => {
    try {
      const options = {};
      if (page) options.page = page;
      if (pageSize) options.pageSize = pageSize;
      if (filter) options.filter = filter;
      if (orderBy) options.orderBy = orderBy;

      const response = await GetPacientes(options);
      setPacientes(response);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
    }
  };

  return (
    <div>
      <div>
        <label>Nome:</label>
        <input type="text" onChange={(e) => setFilter(e.target.value)} />

        <label>Data Consulta:</label>
        <input type="date" />

        <label>Prioridade:</label>
        <select onChange={(e) => setOrderBy(e.target.value)}>
          <option value="1">Baixa</option>
          <option value="2">Média</option>
          <option value="3">Alta</option>
        </select>
      </div>

      <button onClick={getPacientes}>Buscar Pacientes</button>
    </div>
  );
};

export default PesquisarPacientes;
