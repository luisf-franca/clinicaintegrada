import { useState, useEffect, useRef } from 'react';

// FUNCTIONS
import GetPacientes from '../../functions/Pacientes/GetPacientes';

const PesquisarPacientes = ({ onPesquisar }) => {
  const [nome, setNome] = useState('');
  const [resultados, setResultados] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (nome.trim() === '') {
      setResultados([]);
      setShowDropdown(false);
      return;
    }
    const fetchPacientes = async () => {
      try {
        const pacientes = await GetPacientes(nome);
        setResultados(pacientes);
        setShowDropdown(true);
      } catch (error) {
        setResultados([]);
        setShowDropdown(false);
      }
    };
    fetchPacientes();
  }, [nome]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectPaciente = (paciente) => {
    setNome(paciente.nome);
    setShowDropdown(false);
    setResultados([]);
    if (onPesquisar) onPesquisar(paciente.id);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNome(value);
    if (value === '' && onPesquisar) {
      onPesquisar('');
    }
  };

  return (
    <div
      className="pesquisar-paciente-form"
      style={{ position: 'relative' }}
      ref={dropdownRef}
    >
      <div className="form-group">
        <label htmlFor="nome-pesquisa">Nome do Paciente</label>
        <input
          id="nome-pesquisa"
          type="text"
          value={nome}
          onChange={handleInputChange}
          placeholder="Digite o nome para buscar..."
          autoComplete="off"
          onFocus={() => {
            if (resultados.length > 0) setShowDropdown(true);
          }}
        />
      </div>
      {showDropdown && resultados.length > 0 && (
        <div
          className="paciente-dropdown-modal"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--branco)',
            border: '1px solid #ccc',
            zIndex: 1000,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {resultados.map((paciente) => (
            <div
              key={paciente.id}
              className="paciente-dropdown-item"
              style={{ padding: 8, cursor: 'pointer' }}
              onClick={() => handleSelectPaciente(paciente)}
            >
              {paciente.nome}
            </div>
          ))}
          {resultados.length === 0 && (
            <div style={{ padding: 8, color: '#888' }}>
              Nenhum paciente encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PesquisarPacientes;
