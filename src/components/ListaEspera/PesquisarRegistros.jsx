import React, { useState, useEffect } from 'react';

const PesquisarRegistros = ({ onPesquisar, especialidade }) => {
  const [nome, setNome] = useState('');
  const [debouncedNome, setDebouncedNome] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [status, setStatus] = useState('');

  // Debounce para evitar muitas requisições
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNome(nome);
    }, 300);

    return () => clearTimeout(timer);
  }, [nome]);

  // Chama onPesquisar sempre que qualquer filtro mudar
  useEffect(() => {
    if (onPesquisar) {
      onPesquisar({
        nome: debouncedNome,
        prioridade,
        status
      });
    }
  }, [debouncedNome, prioridade, status, onPesquisar]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNome(value);
  };

  const handlePrioridadeChange = (e) => {
    setPrioridade(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  return (
    <div>
      <div>
        <label htmlFor="nome-pesquisa">Nome do Paciente</label>
        <input
          id="nome-pesquisa"
          type="text"
          value={nome}
          onChange={handleInputChange}
          placeholder="Digite o nome para buscar..."
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="prioridade-filter">Prioridade</label>
        <select
          id="prioridade-filter"
          value={prioridade}
          onChange={handlePrioridadeChange}
        >
          <option value="">Todas</option>
          <option value="1">Baixa</option>
          <option value="2">Média</option>
          <option value="3">Alta</option>
        </select>
      </div>

      <div>
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="">Todos</option>
          <option value="1">Aguardando</option>
          <option value="2">Atendido</option>
          <option value="3">Cancelado</option>
        </select>
      </div>
    </div>
  );
};

export default PesquisarRegistros;
