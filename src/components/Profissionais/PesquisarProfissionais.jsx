import React, { useState } from 'react';

const PesquisarProfissionais = ({
  profissionais,
  onPesquisar,
  onEditar,
  onDeletar,
  currentPage,
  totalPages,
  onMudarPagina,
  isLoading,
}) => {
  const [filtros, setFiltros] = useState({
    nome: '',
    tipo: '',
    especialidade: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPesquisar(filtros);
  };

  const getTipoNome = (tipo) => {
    return tipo === 1 ? 'Estagiário' : tipo === 2 ? 'Professor' : 'Desconhecido';
  };

  const getEspecialidadeNome = (especialidade) => {
    const especialidades = {
      1: 'Psicologia',
      2: 'Fisioterapia',
      3: 'Nutrição',
      4: 'Fonoaudiologia',
      5: 'Terapia Ocupacional'
    };
    return especialidades[especialidade] || 'N/A';
  };

  return (
    <div className="pesquisar-profissionais">
      <form className="filtros-form" onSubmit={handleSubmit}>
        <div className="filtros-row">
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={filtros.nome}
              onChange={handleInputChange}
              placeholder="Buscar por nome..."
            />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select
              name="tipo"
              value={filtros.tipo}
              onChange={handleInputChange}
            >
              <option value="">Todos</option>
              <option value="1">Estagiário</option>
              <option value="2">Professor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Especialidade</label>
            <select
              name="especialidade"
              value={filtros.especialidade}
              onChange={handleInputChange}
            >
              <option value="">Todas</option>
              <option value="1">Psicologia</option>
              <option value="2">Fisioterapia</option>
              <option value="3">Nutrição</option>
              <option value="4">Fonoaudiologia</option>
              <option value="5">Terapia Ocupacional</option>
            </select>
          </div>

          <button type="submit" className="btn-primary">
            Pesquisar
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
                  <th>RA</th>
                  <th>Tipo</th>
                  <th>Especialidade</th>
                  <th>Telefone</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {profissionais.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      Nenhum profissional encontrado
                    </td>
                  </tr>
                ) : (
                  profissionais.map((prof) => (
                    <tr key={prof.id}>
                      <td>{prof.nome}</td>
                      <td>{prof.ra}</td>
                      <td>{getTipoNome(prof.tipo)}</td>
                      <td>{getEspecialidadeNome(prof.especialidade)}</td>
                      <td>{prof.telefone}</td>
                      <td>{prof.email}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => onEditar(prof)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => onDeletar(prof.id)}
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

export default PesquisarProfissionais;
