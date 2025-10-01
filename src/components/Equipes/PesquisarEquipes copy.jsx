import React from 'react';

const PesquisarEquipes = ({
  equipes,
  onGerenciar,
  onDeletar,
  currentPage,
  totalPages,
  onMudarPagina,
  isLoading,
}) => {
  return (
    <div className="pesquisar-equipes">
      {isLoading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Especialidade</th>
                  <th>Estagiários</th>
                  <th>Professores</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {equipes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      Nenhuma equipe encontrada
                    </td>
                  </tr>
                ) : (
                  equipes.map((equipe) => (
                    <tr key={equipe.id}>
                      <td>{equipe.especialidadeNome || 'N/A'}</td>
                      <td>{equipe.totalEstagiarios || 0}</td>
                      <td>{equipe.totalProfessores || 0}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => onGerenciar(equipe)}
                          >
                            Gerenciar
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => onDeletar(equipe.id)}
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

export default PesquisarEquipes;
