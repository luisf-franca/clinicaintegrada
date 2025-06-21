import React, { useState } from 'react';

// FUNCTIONS
import GetPacientes from '../../functions/Pacientes/GetPacientes';

// Agora recebe "onPesquisar" como prop
const PesquisarPacientes = ({ onPesquisar }) => {
  const [nome, setNome] = useState('');

  const handleSearchClick = () => {
    // Chama a função do componente pai com o valor do input
    onPesquisar(nome);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleLimparFiltro = () => {
    setNome('');
    // Informa o pai que o filtro foi limpo
    onPesquisar('');
  };

  return (
    <div className="pesquisar-paciente-form">
      <h3>Pesquisar</h3>
      
      <div className="form-group">
        <label htmlFor="nome-pesquisa">Nome do Paciente</label>
        <input
          id="nome-pesquisa"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite o nome para buscar..."
        />
      </div>

      <div className="form-actions-container">
        {nome && (
          <button
            type="button"
            className="btn-secondary"
            onClick={handleLimparFiltro}
          >
            Limpar
          </button>
        )}
        <button
          type="button"
          className="btn-primary"
          onClick={handleSearchClick}
        >
          Pesquisar
        </button>
      </div>
    </div>
  );
};

export default PesquisarPacientes;