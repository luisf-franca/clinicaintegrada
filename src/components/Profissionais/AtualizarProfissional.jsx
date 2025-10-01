import React, { useState, useEffect } from 'react';
import UpdateProfissional from '../../functions/Profissionais/UpdateProfissional';

const AtualizarProfissional = ({ profissional, onVoltar }) => {
  const [formData, setFormData] = useState({
    nome: '',
    ra: '',
    telefone: '',
    email: '',
    tipo: '1',
    especialidade: '1'
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

  // Função para converter string do tipo para número do ENUM
  const getTipoEnum = (tipoString) => {
    const tipoMap = {
      'Estagiario': 1,
      'Professor': 2
    };
    return tipoMap[tipoString] || 1;
  };

  useEffect(() => {
    if (profissional) {
      setFormData({
        nome: profissional.nome || '',
        ra: profissional.ra || '',
        telefone: profissional.telefone || '',
        email: profissional.email || '',
        tipo: typeof profissional.tipo === 'string' 
          ? String(getTipoEnum(profissional.tipo))
          : String(profissional.tipo) || '1',
        especialidade: typeof profissional.especialidade === 'string' 
          ? String(getEspecialidadeEnum(profissional.especialidade))
          : String(profissional.especialidade) || '1'
      });
    }
  }, [profissional]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.ra || !formData.email) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      const profissionalData = {
        ...formData,
        tipo: parseInt(formData.tipo),
        especialidade: parseInt(formData.especialidade)
      };
      
      await UpdateProfissional(profissional.id, profissionalData);
      alert('Profissional atualizado com sucesso!');
      onVoltar();
    } catch (err) {
      console.error('Erro ao atualizar profissional:', err);
      setError('Erro ao atualizar profissional. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Editar Profissional</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome *</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder="Nome completo"
            required
          />
        </div>

        <div className="form-group">
          <label>RA</label>
          <input
            type="text"
            name="ra"
            value={formData.ra}
            onChange={handleInputChange}
            placeholder="Registro Acadêmico"
            required
          />
        </div>

        <div className="form-group">
          <label>Telefone *</label>
          <input
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={handleInputChange}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="email@exemplo.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo *</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
            required
          >
            <option value="1">Estagiário</option>
            <option value="2">Professor</option>
          </select>
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
            <option value="2">Odontologia</option>
            <option value="3">Fisioterapia</option>
            <option value="4">Nutrição</option>
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

export default AtualizarProfissional;
