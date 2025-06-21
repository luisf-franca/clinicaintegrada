import React, { useState, useEffect, useCallback } from 'react';
import '../styles/listaespera.css';

// COMPONENTS
import Especialidade from '../components/Especialidade/Especialidade';
import PesquisarRegistros from '../components/ListaEspera/PesquisarRegistros';
import AdicionarRegistro from '../components/ListaEspera/AdicionarRegistro';
import AtualizarRegistro from '../components/ListaEspera/AtualizarRegistro';
import GetListaEntries from '../functions/ListaEspera/GetListaEntries';
import DeleteRegistro from '../functions/ListaEspera/DeleteListaEsperaEntry';

const ListaEspera = () => {
  const [selectedComponent, setSelectedComponent] = useState('Pesquisar');
  const [registros, setRegistros] = useState([]);
  const [registroSelecionado, setRegistroSelecionado] = useState({});
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    localStorage.getItem('selectedSpecialty') || 1,
  );
  const [filtros, setFiltros] = useState({
    nome: '',
    prioridade: '',
    status: ''
  });

  const atualizarRegistros = useCallback(
    async (filtrosAtuais = filtros) => {
      try {
        const options = {};
        let filters = [`especialidade=${selectedSpecialty}`];
        
        if (filtrosAtuais.nome && filtrosAtuais.nome.trim()) {
          filters.push(`PacienteNome^${filtrosAtuais.nome}`);
        }
        
        if (filtrosAtuais.prioridade && filtrosAtuais.prioridade.trim()) {
          filters.push(`prioridade=${filtrosAtuais.prioridade}`);
        }
        
        if (filtrosAtuais.status && filtrosAtuais.status.trim()) {
          filters.push(`status=${filtrosAtuais.status}`);
        }
        
        if (filters.length > 0) {
          options.filter = filters.join(',');
        }
        
        const items = await GetListaEntries(options);
        setRegistros(items);
      } catch (error) {
        console.error('Erro ao buscar registros:', error);
        setRegistros([]);
      }
    },
    [selectedSpecialty],
  );

  const handlePesquisar = useCallback((novosFiltros) => {
    setFiltros(novosFiltros);
  }, []);

  const handleRegistroClick = (registro) => {
    setRegistroSelecionado(registro);
    setSelectedComponent('Atualizar');
  };

  const handleDeleteRegistro = async (id) => {
    const confirmDelete = window.confirm(
      'Tem certeza que deseja deletar o registro?',
    );
    if (confirmDelete) {
      try {
        await DeleteRegistro(id);
        atualizarRegistros(filtros);
      } catch (error) {
        console.error('Erro ao deletar registro:', error);
      }
    }
  };

  useEffect(() => {
    atualizarRegistros(filtros);
  }, [selectedSpecialty, filtros, atualizarRegistros]);

  return (
    <div className="listaespera container">
      <div className="listaespera-hgroup">
        <h1>Lista de Espera</h1>
        <Especialidade
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={setSelectedSpecialty}
        />
      </div>
      <nav className="listaespera-nav">
        <button
          className={`btn-secondary${
            selectedComponent === 'Pesquisar' ? ' active' : ''
          }`}
          onClick={() => setSelectedComponent('Pesquisar')}
        >
          Pesquisar
        </button>
        <button
          className={`btn-secondary${
            selectedComponent === 'Adicionar' ? ' active' : ''
          }`}
          onClick={() => setSelectedComponent('Adicionar')}
        >
          Adicionar
        </button>
        <button
          className={`btn-secondary${
            selectedComponent === 'Atualizar' ? ' active' : ''
          }`}
          onClick={() => setSelectedComponent('Atualizar')}
        >
          Atualizar
        </button>
      </nav>
      <div className="listaespera-content-wrapper">
        <div className="listaespera-form-card">
          {selectedComponent === 'Pesquisar' && (
            <PesquisarRegistros 
              onPesquisar={handlePesquisar}
              especialidade={selectedSpecialty}
            />
          )}
          {selectedComponent === 'Adicionar' && (
            <AdicionarRegistro
              atualizarRegistros={() => atualizarRegistros(filtros)}
              especialidade={selectedSpecialty}
            />
          )}
          {selectedComponent === 'Atualizar' && (
            <AtualizarRegistro
              registroId={registroSelecionado.id}
              registroInicial={registroSelecionado}
              atualizarRegistros={() => atualizarRegistros(filtros)}
            />
          )}
        </div>
        <div className="listaespera-list-card">
          <table className="pacientes-table">
            <thead className="header-lista">
              <tr>
                <th>Nome</th>
                <th>Data Entrada</th>
                <th>Data Saída</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Especialidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody className="body-lista">
              {registros.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--cinza)' }}>
                    {filtros.nome || filtros.prioridade || filtros.status ? 'Nenhum registro encontrado com os filtros aplicados.' : 'Nenhum registro encontrado.'}
                  </td>
                </tr>
              ) : (
                registros.map((registro) => (
                  <tr
                    key={registro.id}
                    className={
                      registroSelecionado.id === registro.id ? 'selected' : ''
                    }
                    onClick={() => handleRegistroClick(registro)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{registro.nome}</td>
                    <td>{new Date(registro.dataEntrada).toLocaleString()}</td>
                    <td>
                      {registro.dataSaida
                        ? new Date(registro.dataSaida).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td>{registro.status}</td>
                    <td>{registro.prioridade}</td>
                    <td>{registro.especialidade}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRegistro(registro.id);
                        }}
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListaEspera;
