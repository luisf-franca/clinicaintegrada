import React, { useState } from 'react';
import CreateSala from '../../functions/Salas/CreateSala';

const AdicionarSala = ({ especialidade, onVoltar }) => {
  const [formData, setFormData] = useState({
    nome: '',
    especialidade: especialidade || '1',
    disponibilidade: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome) {
      setError('Por favor, preencha o nome da sala');
      return;
    }

    setIsLoading(true);
    try {
      const salaData = {
        ...formData,
        especialidade: parseInt(formData.especialidade)
      };
      
      await CreateSala(salaData);
      alert('Sala cadastrada com sucesso!');
      onVoltar();
    } catch (err) {
      console.error('Erro ao cadastrar sala:', err);
      setError('Erro ao cadastrar sala. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Adicionar Sala</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome *</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder="Nome da sala"
            required
          />
        </div>

        <div className="form-group">
          <label>Especialidade *</label>
          <select
            name="especialidade"
            value={formData.especialidade}
            onChange={handleInputChange}
            required
          >
            <option value="1">Psicologia</option>
            <option value="2">Fisioterapia</option>
            <option value="3">Nutrição</option>
            <option value="4">Fonoaudiologia</option>
            <option value="5">Terapia Ocupacional</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="disponibilidade"
              checked={formData.disponibilidade}
              onChange={handleInputChange}
            />
            <span>Disponível</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onVoltar} className="btn-secondary">
            Voltar
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdicionarSala;
