// src/components/Equipes/AdicionarEquipe.jsx

import React, { useState } from 'react';
import CreateEquipe from '../../functions/Equipes/CreateEquipe';

// onEquipeCriada é uma nova prop para notificar o pai e ir para a próxima etapa.
const AdicionarEquipe = ({ onVoltar, onEquipeCriada }) => {
  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('1'); // Valor padrão
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

const getEspecialidadeNome = (valor) => {
  const mapa = {
    '1': 'Psicologia',
    '2': 'Odontologia',
    '3': 'Fisioterapia',
    '4': 'Nutrição'
  };
  return mapa[valor] || '';
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError('O nome da equipe é obrigatório.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const equipeData = {
        nome,
        especialidade: parseInt(especialidade, 10),
        // Não enviamos mais estagiários ou professores na criação.
      };
      
      const response = await CreateEquipe(equipeData);
      
      if (response.succeeded && response.data) {
        const novaEquipe = {
          id: response.data,
          nome: nome,        
          especialidade: getEspecialidadeNome(especialidade) 
        };
        
        onEquipeCriada(novaEquipe);
      } else {
        throw new Error(response.error || 'Falha ao obter ID da nova equipe.');
      }

    } catch (err) {
      console.error('Erro ao criar equipe:', err);
      setError('Erro ao criar equipe. Verifique o nome e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Etapa 1: Criar Nova Equipe</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome da Equipe *</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Equipe"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="especialidade">Especialidade *</label>
          <select
            id="especialidade"
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
            required
          >
            <option value="1">Psicologia</option>
            <option value="2">Odontologia</option>
            <option value="3">Fisioterapia</option>
            <option value="4">Nutrição</option>
          </select>
        </div>

        {/* A seleção de membros foi removida desta etapa */}

        <div className="form-actions">
          <button type="button" onClick={onVoltar} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Criando...' : 'Avançar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdicionarEquipe;