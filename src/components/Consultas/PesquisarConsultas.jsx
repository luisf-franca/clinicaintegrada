import React, { useState } from 'react';

const PesquisarConsultas = ({ onPesquisar, especialidade, dataFiltro }) => {
  const [nome, setNome] = useState('');
  const [status, setStatus] = useState('');
  const [tipo, setTipo] = useState('');

  const handleBuscar = () => {
    onPesquisar({
      nome,
      status,
      tipo,
      especialidade,
      dataFiltro
    });
  };

  const handleNomeChange = (e) => {
    setNome(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const clearFilter = () => {
    setNome('');
    setStatus('');
    setTipo('');
    // Dispara busca limpa mantendo especialidade e data externa se existirem
    onPesquisar({
      nome: '',
      status: '',
      tipo: '',
      especialidade,
      dataFiltro
    });
  };

  return (
    <>
      {/* Grupo: Nome */}
      <div className="filter-group">

        {/* Botão Limpar condicional ou fixo */}
        {(nome || status || tipo) && (
          <button
            className="btn-limpar"
            onClick={clearFilter}
          >
            Limpar Filtros
          </button>
        )}

        {/* <label className="filter-label">Nome:</label> */}
        <input
          type="text"
          value={nome}
          onChange={handleNomeChange}
          onKeyDown={handleKeyDown}
          placeholder="Nome do Paciente"
        />

      </div>

      {/* Grupo: Status */}
      <div className="filter-group">
        {/* <label className="filter-label">Status</label> */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Todos os Status</option>
          <option value="Agendada">Agendada</option>
          <option value="Triagem">Triagem</option>
          <option value="AguardandoConsulta">Aguardando Consulta</option>
          <option value="EmAndamento">Em Andamento</option>
          <option value="Concluída">Concluída</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>

      {/* Grupo: Tipo */}
      <div className="filter-group">
        {/* <label className="filter-label">Tipo</label> */}
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Todos os Tipos</option>
          <option value="1">Triagens</option>
          <option value="2">Consultas</option>
        </select>
      </div>

      <button className="btn-buscar" onClick={handleBuscar}>
        Buscar
      </button>
    </>
  );
};

export default PesquisarConsultas;