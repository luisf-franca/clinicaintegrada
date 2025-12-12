import { useState, useEffect, useRef } from 'react';

const PesquisarPacientes = ({ onPesquisar, initialValue = '' }) => {
  const [nome, setNome] = useState(initialValue);
  const [debouncedNome, setDebouncedNome] = useState(initialValue);

  // Debounce para evitar muitas requisições
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNome(nome);
    }, 300);

    return () => clearTimeout(timer);
  }, [nome]);

  // Chama onPesquisar sempre que o nome debounced mudar
  useEffect(() => {
    if (onPesquisar) {
      onPesquisar(debouncedNome);
    }
  }, [debouncedNome, onPesquisar]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNome(value);
  };

  return (
    <div className="pesquisar-paciente-form">
      <div className="form-group">
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
    </div>
  );
};

export default PesquisarPacientes;
