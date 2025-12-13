import React, { useState } from 'react';
import '../../styles/forms.css';
import CreateSala from '../../functions/Salas/CreateSala';

const AdicionarSala = ({ onVoltar }) => {
  const [formData, setFormData] = useState({
    nome: '',
    especialidade: 1,
    capacidade: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        especialidade: parseInt(formData.especialidade),
        capacidade: parseInt(formData.capacidade),
      };

      await CreateSala(salaData);
      // alert('Sala cadastrada com sucesso!');
      onVoltar();
    } catch (err) {
      console.error('Erro ao cadastrar sala:', err);
      setError('Erro ao cadastrar sala. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container flat">
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
          <label>Capacidade Equipes *</label>
          <input
            type="number"
            name="capacidade"
            value={formData.capacidade}
            onChange={handleInputChange}
            placeholder="Capacidade da sala"
            min="1"
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
            <option value={1}>Psicologia</option>
            <option value={2}>Odontologia</option>
            <option value={3}>Fisioterapia</option>
            <option value={4}>Nutrição</option>
          </select>
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
