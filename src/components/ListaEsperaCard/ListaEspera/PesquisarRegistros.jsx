import React, { useState, useEffect } from 'react';
import './PesquisarRegistros.css';

// COMPONENTS
import GetPacientes from '../../../functions/Pacientes/GetPacientes';

const PesquisarRegistros = ({ setRegistros }) => {
  const [pageSize] = useState(4); // Limite para dropdown
  const [nome, setNome] = useState('');
  const [sugestoes, setSugestoes] = useState([]);

  useEffect(() => {
    if (nome.trim() === '') {
      setSugestoes([]); // Limpa as sugestões quando o nome é apagado
    } else {
      getPacientes(); // Busca enquanto o usuário digita
    }
  }, [nome]);

  const getPacientes = async () => {
    try {
      const response = await GetPacientes({
        filter: nome.trim(),
        pageSize, // Traz apenas os primeiros 4 registros
        page: 1,
      });
      setSugestoes(response); // Atualiza as sugestões com a resposta
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
    }
  };

  const handleNomeChange = (e) => {
    setNome(e.target.value); // Atualiza o estado do nome
  };

  const handleSugestaoClick = (paciente) => {
    setNome(paciente.nome); // Define o nome ao clicar em uma sugestão
    setSugestoes([]); // Limpa as sugestões
  };

  const clearFilter = () => {
    setNome(''); // Limpa o filtro
    setSugestoes([]); // Limpa as sugestões
  };

  return (
    <div>
      <div>
        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={handleNomeChange}
        />
        {nome && (
          <button onClick={clearFilter}>Limpar</button>
        )}
      </div>
      {sugestoes.length > 0 && (
        <ul className="dropdown-sugestoes">
          {sugestoes.map((paciente) => (
            <li
              key={paciente.id}
              onClick={() => handleSugestaoClick(paciente)}
            >
              {paciente.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PesquisarRegistros;
