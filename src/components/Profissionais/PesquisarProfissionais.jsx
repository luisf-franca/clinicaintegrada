import React, { useState, useEffect } from 'react';

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

  // Efeito para filtrar automaticamente quando tipo ou especialidade mudarem
  useEffect(() => {
    const filtrosComEspecialidade = { ...filtros };
    if (filtros.especialidade === '' || filtros.especialidade === '0') {
      delete filtrosComEspecialidade.especialidade;
    }
    onPesquisar(filtrosComEspecialidade);
  }, [filtros.tipo, filtros.especialidade]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleTipoChange = (e) => {
    setFiltros(prev => ({ ...prev, tipo: e.target.value }));
  };

  const handleEspecialidadeChange = (e) => {
    setFiltros(prev => ({ ...prev, especialidade: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filtrosComEspecialidade = { ...filtros };
    if (filtros.especialidade === '' || filtros.especialidade === '0') {
      delete filtrosComEspecialidade.especialidade;
    }
    onPesquisar(filtrosComEspecialidade);
  };

  // Função para converter string da API para nome legível
  const getEspecialidadeNomeFromString = (especialidadeString) => {
    return especialidadeString === 'Nutricao' ? 'Nutrição' : especialidadeString;
  };

  return (
    <div className="pesquisar-profissionais">
      <form className="filtros-form" onSubmit={handleSubmit}>
        <div className="filtros-row">

          <div className="form-group">
            <label>Tipo</label>
            <select
              name="tipo"
              value={filtros.tipo}
              onChange={handleTipoChange}
            >
              <option value="">Todos</option>
              <option value="Estagiario">Estagiário</option>
              <option value="Professor">Professor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Especialidade</label>
            <select
              name="especialidade"
              value={filtros.especialidade}
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
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={filtros.nome}
              onChange={handleInputChange}
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
                      <td>{prof.ra || 'N/A'}</td>
                      <td>{prof.tipo === 'Estagiario' ? 'Estagiário' : prof.tipo}</td>
                      <td>{getEspecialidadeNomeFromString(prof.especialidade)}</td>
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
