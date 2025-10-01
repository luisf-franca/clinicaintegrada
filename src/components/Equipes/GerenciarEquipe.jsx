import React, { useState, useEffect } from 'react';
import GetEquipeById from '../../functions/Equipes/GetEquipeById';
import GetProfissionais from '../../functions/Profissionais/GetProfissionais';
import AdicionarProfissionalEquipe from '../../functions/Equipes/AdicionarProfissionalEquipe';
import RemoverProfissionalEquipe from '../../functions/Equipes/RemoverProfissionalEquipe';

const GerenciarEquipe = ({ equipe, onVoltar }) => {
  const [equipeAtual, setEquipeAtual] = useState(null);
  const [profissionaisDisponiveis, setProfissionaisDisponiveis] = useState({
    estagiarios: [],
    professores: []
  });
  const [selectedProfissional, setSelectedProfissional] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [equipe.id]);

  const carregarDados = async () => {
    try {
      const equipeResponse = await GetEquipeById(equipe.id);
      setEquipeAtual(equipeResponse.data);

      const responseEstagiarios = await GetProfissionais({
        filter: `tipo=1,especialidade=${equipe.especialidade}`,
        pageSize: 100
      });
      
      const responseProfessores = await GetProfissionais({
        filter: `tipo=2,especialidade=${equipe.especialidade}`,
        pageSize: 100
      });

      setProfissionaisDisponiveis({
        estagiarios: responseEstagiarios?.items || [],
        professores: responseProfessores?.items || []
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleAdicionarProfissional = async () => {
    if (!selectedProfissional) {
      alert('Selecione um profissional');
      return;
    }

    setIsLoading(true);
    try {
      await AdicionarProfissionalEquipe({
        equipeId: equipe.id,
        profissionalId: selectedProfissional
      });
      alert('Profissional adicionado com sucesso!');
      setSelectedProfissional('');
      carregarDados();
    } catch (error) {
      console.error('Erro ao adicionar profissional:', error);
      alert('Erro ao adicionar profissional');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoverProfissional = async (profissionalId) => {
    if (!window.confirm('Tem certeza que deseja remover este profissional da equipe?')) {
      return;
    }

    setIsLoading(true);
    try {
      await RemoverProfissionalEquipe({
        equipeId: equipe.id,
        profissionalId
      });
      alert('Profissional removido com sucesso!');
      carregarDados();
    } catch (error) {
      console.error('Erro ao remover profissional:', error);
      alert('Erro ao remover profissional');
    } finally {
      setIsLoading(false);
    }
  };

  const getProfissionaisDisponiveis = () => {
    const tipo = parseInt(selectedTipo);
    const lista = tipo === 1 ? profissionaisDisponiveis.estagiarios : profissionaisDisponiveis.professores;
    const idsEquipe = equipeAtual ? [
      ...(equipeAtual.estagiarios || []).map(e => e.id),
      ...(equipeAtual.professores || []).map(p => p.id)
    ] : [];
    
    return lista.filter(prof => !idsEquipe.includes(prof.id));
  };

  if (!equipeAtual) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="form-container">
      <h2>Gerenciar Equipe</h2>
      
      <div className="equipe-info">
        <h3>Informações da Equipe</h3>
        <p><strong>Especialidade:</strong> {equipe.especialidadeNome}</p>
      </div>

      <div className="equipe-membros">
        <h3>Estagiários</h3>
        <div className="membros-lista">
          {equipeAtual.estagiarios && equipeAtual.estagiarios.length > 0 ? (
            equipeAtual.estagiarios.map(est => (
              <div key={est.id} className="membro-item">
                <span>{est.nome} - {est.ra}</span>
                <button
                  className="btn-delete-small"
                  onClick={() => handleRemoverProfissional(est.id)}
                  disabled={isLoading}
                >
                  Remover
                </button>
              </div>
            ))
          ) : (
            <p className="empty-state">Nenhum estagiário na equipe</p>
          )}
        </div>

        <h3>Professores</h3>
        <div className="membros-lista">
          {equipeAtual.professores && equipeAtual.professores.length > 0 ? (
            equipeAtual.professores.map(prof => (
              <div key={prof.id} className="membro-item">
                <span>{prof.nome} - {prof.ra}</span>
                <button
                  className="btn-delete-small"
                  onClick={() => handleRemoverProfissional(prof.id)}
                  disabled={isLoading}
                >
                  Remover
                </button>
              </div>
            ))
          ) : (
            <p className="empty-state">Nenhum professor na equipe</p>
          )}
        </div>
      </div>

      <div className="adicionar-profissional">
        <h3>Adicionar Profissional</h3>
        <div className="form-inline">
          <div className="form-group">
            <label>Tipo</label>
            <select
              value={selectedTipo}
              onChange={(e) => {
                setSelectedTipo(e.target.value);
                setSelectedProfissional('');
              }}
              disabled={isLoading}
            >
              <option value="1">Estagiário</option>
              <option value="2">Professor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Profissional</label>
            <select
              value={selectedProfissional}
              onChange={(e) => setSelectedProfissional(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Selecione...</option>
              {getProfissionaisDisponiveis().map(prof => (
                <option key={prof.id} value={prof.id}>
                  {prof.nome} - {prof.ra}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn-primary"
            onClick={handleAdicionarProfissional}
            disabled={isLoading || !selectedProfissional}
          >
            {isLoading ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onVoltar} className="btn-secondary">
          Voltar
        </button>
      </div>
    </div>
  );
};

export default GerenciarEquipe;
