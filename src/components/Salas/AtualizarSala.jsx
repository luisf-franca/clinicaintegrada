import React, { useState, useEffect } from 'react';
import UpdateSala from '../../functions/Salas/UpdateSala';

const AtualizarSala = ({ sala, onVoltar }) => {
  const [formData, setFormData] = useState({
    nome: '',
    especialidade: '1',
    disponibilidade: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sala) {
      setFormData({
        nome: sala.nome || '',
        especialidade: String(sala.especialidade) || '1',
        disponibilidade: sala.disponibilidade ?? true
      });
    }
  }, [sala]);

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
      
      await UpdateSala(sala.id, salaData);
      alert('Sala atualizada com sucesso!');
      onVoltar();
    } catch (err) {
      console.error('Erro ao atualizar sala:', err);
      setError('Erro ao atualizar sala. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Editar Sala</h2>
      
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

export default AtualizarSala;
