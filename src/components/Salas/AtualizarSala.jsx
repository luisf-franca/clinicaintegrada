import React, { useState, useEffect } from 'react';
import UpdateSala from '../../functions/Salas/UpdateSala';

const AtualizarSala = ({ sala, onVoltar }) => {
  const [formData, setFormData] = useState({
    nome: '',
    especialidade: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Função para converter string da especialidade para número do ENUM
  const getEspecialidadeEnum = (especialidadeString) => {
    const especialidadeMap = {
      'Psicologia': 1,
      'Odontologia': 2, 
      'Fisioterapia': 3,
      'Nutricao': 4,
      'Nutrição': 4
    };
    return especialidadeMap[especialidadeString] || 1;
  };

  useEffect(() => {
    if (sala) {
      setFormData({
        nome: sala.nome || '',
        especialidade: typeof sala.especialidade === 'string' 
          ? getEspecialidadeEnum(sala.especialidade) 
          : Number(sala.especialidade) || 1
      });
    }
  }, [sala]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      // alert('Sala atualizada com sucesso!');
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

export default AtualizarSala;
