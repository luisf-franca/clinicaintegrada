import React, { useState } from 'react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onPesquisar(filtroDisponibilidade);
  };

  const handleToggleDisponibilidade = async (sala) => {
    try {
      await BloquearDesbloquearSala(sala.id, !sala.disponibilidade);
      // Atualizar lista após alteração
      onPesquisar(filtroDisponibilidade);
    } catch (error) {
      console.error('Erro ao alterar disponibilidade da sala:', error);
      alert('Erro ao alterar disponibilidade da sala');
    }
  };

  return (
    <div className="pesquisar-salas">
      <form className="filtros-form" onSubmit={handleSubmit}>
        <div className="filtros-row">
          <div className="form-group">
            <label>Disponibilidade</label>
            <select
              value={filtroDisponibilidade}
              onChange={(e) => setFiltroDisponibilidade(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="true">Disponível</option>
              <option value="false">Indisponível</option>
            </select>
          </div>

          <button type="submit" className="btn-primary">
            Filtrar
          </button>
        </div>
      </form>

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
                  <th>Disponibilidade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {salas.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      Nenhuma sala encontrada
                    </td>
                  </tr>
                ) : (
                  salas.map((sala) => (
                    <tr key={sala.id}>
                      <td>{sala.nome}</td>
                      <td>{sala.especialidadeNome || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${sala.disponibilidade ? 'disponivel' : 'indisponivel'}`}>
                          {sala.disponibilidade ? 'Disponível' : 'Indisponível'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-toggle"
                            onClick={() => handleToggleDisponibilidade(sala)}
                          >
                            {sala.disponibilidade ? 'Bloquear' : 'Desbloquear'}
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
