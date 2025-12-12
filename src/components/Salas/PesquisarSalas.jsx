import React, { useState, useEffect } from 'react';
import BloquearDesbloquearSala from '../../functions/Salas/BloquearDesbloquearSala';

const PesquisarSalas = ({
  salas,
  onPesquisar,
  onEditar,
  onDeletar,
  currentPage,
  totalPages,
  onMudarPagina,
  isLoading,
}) => {

  const [filtroDisponibilidade, setFiltroDisponibilidade] = useState('');
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("");

  // Efeito para filtrar automaticamente quando os filtros mudarem
  useEffect(() => {
    onPesquisar({ disponibilidade: filtroDisponibilidade, especialidade: filtroEspecialidade });
  }, [filtroDisponibilidade, filtroEspecialidade]);

  const handleDisponibilidadeChange = (e) => {
    setFiltroDisponibilidade(e.target.value);
  };

  const handleEspecialidadeChange = (e) => {
    setFiltroEspecialidade(e.target.value);
  };

  const handleToggleDisponibilidade = async (sala) => {
    try {
      await BloquearDesbloquearSala(sala.id, !sala.isDisponivel);
      // Atualizar lista após alteração
      onPesquisar({ disponibilidade: filtroDisponibilidade, especialidade: filtroEspecialidade });
    } catch (error) {
      console.error('Erro ao alterar disponibilidade da sala:', error);
      alert('Erro ao alterar disponibilidade da sala');
    }
  };

  // Função para formatar nome da especialidade
  const getEspecialidadeNome = (especialidade) => {
    return especialidade === 'Nutricao' ? 'Nutrição' : especialidade;
  };

  return (
    <div className="pesquisar-salas">
      <div className="filtros-form">
        <div className="filtros-row">
          <div className="form-group">
            <label>Disponibilidade</label>
            <select
              value={filtroDisponibilidade}
              onChange={handleDisponibilidadeChange}
            >
              <option value="">Todas</option>
              <option value={true}>Disponível</option>
              <option value={false}>Indisponível</option>
            </select>
          </div>

          <div className="form-group">
            <label>Especialidade</label>
            <select
              value={filtroEspecialidade}
              onChange={handleEspecialidadeChange}
            >
              <option value="">Todas</option>
              <option value="1">Psicologia</option>
              <option value="2">Odontologia</option>
              <option value="3">Fisioterapia</option>
              <option value="4">Nutrição</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Especialidade</th>
                  <th>Capacidade</th>
                  <th>Disponibilidade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {salas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      Nenhuma sala encontrada
                    </td>
                  </tr>
                ) : (
                  salas.map((sala) => (
                    <tr key={sala.id}>
                      <td>{sala.nome}</td>
                      <td>{getEspecialidadeNome(sala.especialidade)}</td>
                      <td>{sala.capacidade}</td>
                      <td>
                        <span className={`status-badge ${sala.isDisponivel ? 'disponivel' : 'indisponivel'}`}>
                          {sala.isDisponivel ? 'Disponível' : 'Indisponível'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-toggle"
                            onClick={() => handleToggleDisponibilidade(sala)}
                          >
                            {sala.isDisponivel ? 'Bloquear' : 'Desbloquear'}
                          </button>
                          <button
                            className="btn-edit"
                            onClick={() => onEditar(sala)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => onDeletar(sala.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => onMudarPagina(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-pagination"
              >
                Anterior
              </button>
              <span className="page-info">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => onMudarPagina(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-pagination"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PesquisarSalas;
