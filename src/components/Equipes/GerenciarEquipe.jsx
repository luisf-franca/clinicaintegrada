// src/components/Equipes/GerenciarEquipe.jsx

import React, { useState, useEffect, useCallback } from 'react';
import GetEquipeById from '../../functions/Equipes/GetEquipeById';
import GetProfissionais from '../../functions/Profissionais/GetProfissionais';
import AdicionarProfissionalEquipe from '../../functions/Equipes/AdicionarProfissionalEquipe';
import RemoverProfissionalEquipe from '../../functions/Equipes/RemoverProfissionalEquipe';
import useDebounce from '../../hooks/useDebounce'; // Hook customizado para debouncing

const GerenciarEquipe = ({ equipe, onVoltar }) => {
  const [equipeAtual, setEquipeAtual] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- Estados para a nova busca ---
  const [tipoBusca, setTipoBusca] = useState(''); // '' para todos, '1' para estagiário, '2' para professor
  const [termoBusca, setTermoBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [isBuscando, setIsBuscando] = useState(false);

  // Hook para evitar chamadas de API a cada tecla digitada
  const debouncedTermoBusca = useDebounce(termoBusca, 500); // 500ms de delay

  const carregarDadosEquipe = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await GetEquipeById(equipe.id);
      setEquipeAtual(response.data);
    } catch (error) {
      console.error('Erro ao carregar dados da equipe:', error);
    } finally {
      setIsLoading(false);
    }
  }, [equipe.id]);

  useEffect(() => {
    carregarDadosEquipe();
  }, [carregarDadosEquipe]);

  // Efeito para buscar profissionais quando o termo de busca (debounced) muda
  useEffect(() => {
    if (debouncedTermoBusca.length < 3) {
      setResultadosBusca([]);
      return;
    }

    const buscarProfissionais = async () => {
      setIsBuscando(true);
      try {
        // A função GetProfissionais precisa suportar filtro por nome, ex: 'nome=João'
        const especialidadeString = equipeAtual?.especialidade; // Ex: 'Psicologia'
        
        // Constrói os filtros dinamicamente
        let filtros = [];
        if (tipoBusca) { // Só adiciona o filtro de tipo se não for "Todos" (valor vazio)
          filtros.push(`tipo=${tipoBusca}`);
        }
        filtros.push(`especialidade=${especialidadeString}`);
        filtros.push(`nome=*${debouncedTermoBusca}`);
        
        const response = await GetProfissionais({
          filter: filtros.join(','),
          pageSize: 10,
        });

        const membrosAtuaisIds = [
          ...(equipeAtual?.estagiarios?.map(e => e.id) || []),
          ...(equipeAtual?.professores?.map(p => p.id) || []),
        ];

        // Filtra os resultados para não mostrar quem já está na equipe
        const profissionaisFiltrados = (response?.items || []).filter(
          prof => !membrosAtuaisIds.includes(prof.id)
        );

        setResultadosBusca(profissionaisFiltrados);
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
      } finally {
        setIsBuscando(false);
      }
    };

    buscarProfissionais();
  }, [debouncedTermoBusca, tipoBusca, equipeAtual]);


  const handleAdicionarProfissional = async (profissionalId) => {
    setIsLoading(true);
    try {
      await AdicionarProfissionalEquipe({ equipeId: equipe.id, profissionalId });
      setTermoBusca(''); // Limpa a busca
      setResultadosBusca([]); // Limpa os resultados
      await carregarDadosEquipe(); // Recarrega os membros da equipe
    } catch (error) {
      console.error('Erro ao adicionar profissional:', error);
      alert('Erro ao adicionar profissional.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoverProfissional = async (profissionalId) => {
    if (!window.confirm('Remover este profissional da equipe?')) return;
    setIsLoading(true);
    try {
      await RemoverProfissionalEquipe({ equipeId: equipe.id, profissionalId });
      await carregarDadosEquipe();
    } catch (error) {
      console.error('Erro ao remover profissional:', error);
      alert('Erro ao remover profissional.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!equipeAtual) return <div className="loading">Carregando...</div>;

  return (
    <div className="form-container">
      {/* O Título pode ser dinâmico para indicar se é uma criação ou edição */}
      <h2>Gerenciar Membros da Equipe: {equipeAtual.nome}</h2>
      <p><strong>Especialidade:</strong> {equipeAtual.especialidade}</p>

      {/* Seção para Adicionar Novos Membros */}
      <div className="adicionar-profissional">
        <h3>Adicionar Profissional</h3>
        <div className="form-inline">
          <div className="form-group">
            <label>Tipo</label>
            <select value={tipoBusca} onChange={(e) => setTipoBusca(e.target.value)}>
              <option value="">Todos</option>
              <option value="1">Estagiário</option>
              <option value="2">Professor</option>
            </select>
          </div>
          <div className="form-group" style={{ flexGrow: 1 }}>
            <label>Pesquisar por nome</label>
            <input
              type="text"
              placeholder="Digite no mínimo 3 letras..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
        </div>
        
        {/* Lista de Resultados da Busca */}
        <div className="search-results">
          {isBuscando && <p>Buscando...</p>}
          {!isBuscando && debouncedTermoBusca.length >= 3 && resultadosBusca.length === 0 && <p>Nenhum profissional encontrado.</p>}
          {resultadosBusca.map(prof => (
            <div key={prof.id} className="result-item">
              <span>{prof.nome} - {prof.ra}</span>
              <button onClick={() => handleAdicionarProfissional(prof.id)} className="btn-add-small">
                Adicionar
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Listas de Membros Atuais */}
      <div className="equipe-membros">
        <h3>Estagiários na Equipe</h3>
        {equipeAtual.estagiarios?.length > 0 ? (
          equipeAtual.estagiarios.map(est => (
             <div key={est.id} className="membro-item">
               <span>{est.nome} - {est.ra}</span>
               <button onClick={() => handleRemoverProfissional(est.id)} className="btn-delete-small">Remover</button>
             </div>
          ))
        ) : <p>Nenhum estagiário na equipe.</p>}

        <h3>Professores na Equipe</h3>
        {equipeAtual.professores?.length > 0 ? (
          equipeAtual.professores.map(prof => (
             <div key={prof.id} className="membro-item">
               <span>{prof.nome} - {prof.ra}</span>
               <button onClick={() => handleRemoverProfissional(prof.id)} className="btn-delete-small">Remover</button>
             </div>
          ))
        ) : <p>Nenhum professor na equipe.</p>}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onVoltar} className="btn-secondary">
          Concluir
        </button>
      </div>
    </div>
  );
};

export default GerenciarEquipe;