import React, { useState, useEffect } from 'react';
import CreateEquipe from '../../functions/Equipes/CreateEquipe';
import GetProfissionais from '../../functions/Profissionais/GetProfissionais';

const AdicionarEquipe = ({ especialidade, onVoltar }) => {
  const [formData, setFormData] = useState({
    especialidade: especialidade || '1',
    estagiarios: [],
    professores: []
  });
  const [profissionaisDisponiveis, setProfissionaisDisponiveis] = useState({
    estagiarios: [],
    professores: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarProfissionais();
  }, [formData.especialidade]);

  const carregarProfissionais = async () => {
    try {
      const responseEstagiarios = await GetProfissionais({
        filter: `tipo=1,especialidade=${formData.especialidade}`,
        pageSize: 100
      });
      
      const responseProfessores = await GetProfissionais({
        filter: `tipo=2,especialidade=${formData.especialidade}`,
        pageSize: 100
      });

      setProfissionaisDisponiveis({
        estagiarios: responseEstagiarios?.items || [],
        professores: responseProfessores?.items || []
      });
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
    }
  };

  const handleEspecialidadeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      especialidade: e.target.value,
      estagiarios: [],
      professores: []
    }));
  };

  const handleCheckboxChange = (tipo, profissionalId) => {
    setFormData(prev => {
      const campo = tipo === 1 ? 'estagiarios' : 'professores';
      const lista = prev[campo];
      
      if (lista.includes(profissionalId)) {
        return {
          ...prev,
          [campo]: lista.filter(id => id !== profissionalId)
        };
      } else {
        return {
          ...prev,
          [campo]: [...lista, profissionalId]
        };
      }
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.estagiarios.length === 0 && formData.professores.length === 0) {
      setError('Selecione pelo menos um profissional para a equipe');
      return;
    }

    setIsLoading(true);
    try {
      const equipeData = {
        especialidade: parseInt(formData.especialidade),
        estagiarios: formData.estagiarios,
        professores: formData.professores
      };
      
      await CreateEquipe(equipeData);
      alert('Equipe cadastrada com sucesso!');
      onVoltar();
    } catch (err) {
      console.error('Erro ao cadastrar equipe:', err);
      setError('Erro ao cadastrar equipe. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Adicionar Equipe</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Especialidade *</label>
          <select
            name="especialidade"
            value={formData.especialidade}
            onChange={handleEspecialidadeChange}
            required
          >
            <option value="1">Psicologia</option>
            <option value="2">Fisioterapia</option>
            <option value="3">Nutrição</option>
            <option value="4">Fonoaudiologia</option>
            <option value="5">Terapia Ocupacional</option>
          </select>
        </div>

        <div className="form-group">
          <label>Estagiários</label>
          <div className="checkbox-list">
            {profissionaisDisponiveis.estagiarios.length === 0 ? (
              <p className="empty-state">Nenhum estagiário disponível para esta especialidade</p>
            ) : (
              profissionaisDisponiveis.estagiarios.map(prof => (
                <label key={prof.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.estagiarios.includes(prof.id)}
                    onChange={() => handleCheckboxChange(1, prof.id)}
                  />
                  <span>{prof.nome} - {prof.ra}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Professores</label>
          <div className="checkbox-list">
            {profissionaisDisponiveis.professores.length === 0 ? (
              <p className="empty-state">Nenhum professor disponível para esta especialidade</p>
            ) : (
              profissionaisDisponiveis.professores.map(prof => (
                <label key={prof.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.professores.includes(prof.id)}
                    onChange={() => handleCheckboxChange(2, prof.id)}
                  />
                  <span>{prof.nome} - {prof.ra}</span>
                </label>
              ))
            )}
          </div>
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

export default AdicionarEquipe;
