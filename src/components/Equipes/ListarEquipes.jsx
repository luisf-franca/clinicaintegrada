import React, { useState, useEffect } from 'react';

const ListarEquipes = ({
  equipes,
  onPesquisar,
  onGerenciar,
  onDeletar,
  currentPage,
  totalPages,
  onMudarPagina,
  isLoading,
}) => {
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroEspecialidade, setFiltroEspecialidade] = useState('');

  // Efeito para filtrar automaticamente quando a especialidade mudar
  useEffect(() => {
    onPesquisar({ nome: filtroNome, especialidade: filtroEspecialidade });
  }, [filtroEspecialidade]);

  const handleNomeChange = (e) => {
    setFiltroNome(e.target.value);
  };

  const handleEspecialidadeChange = (e) => {
    setFiltroEspecialidade(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPesquisar({ nome: filtroNome, especialidade: filtroEspecialidade });
  };

  return (
    <div className="pesquisar-equipes">
      <form className="filtros-form" onSubmit={handleSubmit}>
        <div className="filtros-row">

          <div className="form-group">
            <label>Especialidade</label>
            <select
              name="especialidade"
              value={filtroEspecialidade}
              onChange={handleEspecialidadeChange}
            >
              <option value="">Todas</option>
              <option value="Psicologia">Psicologia</option>
              <option value="Odontologia">Odontologia</option>
              <option value="Fisioterapia">Fisioterapia</option>
              <option value="Nutricao">Nutrição</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nome da Equipe</label>
            <input
              type="text"
              name="nome"
              value={filtroNome}
              onChange={handleNomeChange}
              placeholder="Buscar por nome..."
            />
          </div>

          <button type="submit" className="btn-primary">
            Buscar
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
                  <th>Professor</th>
                  <th>Estagiários</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {equipes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      Nenhuma equipe encontrada
                    </td>
                  </tr>
                ) : (
                  equipes.map((equipe) => (
                    <tr key={equipe.id}>
                      <td>{equipe.nome}</td>
                      <td>{equipe.especialidade === 'Nutricao' ? 'Nutrição' : equipe.especialidade}</td>
                      <td>{equipe.professores?.length > 0 ? equipe.professores[0].nome : 'Não definido'}</td>
                      <td>{equipe.estagiarios?.length || 0}</td>
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

export default ListarEquipes;
