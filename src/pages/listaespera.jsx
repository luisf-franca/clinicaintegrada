import React, { useState, useEffect } from 'react';
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
  const [selectedSpecialty, setSelectedSpecialty] = useState(1);

  // Função para atualizar os registros
  const atualizarRegistros = async () => {
    try {
      const items = await GetListaEntries({ filter: "especialidade=" + selectedSpecialty });
      setRegistros(items);
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
    }
  };

  const handleRegistroClick = (registro) => {
    console.log('Registro selecionado:', registro);
    setRegistroSelecionado(registro);
    setSelectedComponent('Atualizar');
  };

  const handleDeleteRegistro = async (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar o registro?');
    if (confirmDelete) {
      try {
        await DeleteRegistro(id);
        alert('Registro deletado com sucesso!');
        atualizarRegistros(); // Atualiza a lista após deletar
      } catch (error) {
        console.error('Erro ao deletar registro:', error);
        alert('Erro ao deletar registro.');
      }
    } else {
      // alert('Ação cancelada.');
    }
  };

  useEffect(() => {
    atualizarRegistros();
  }, []);

  return (
    <div className="pacientes">
      <div className="pacientes-header">
        <h2>Lista de Espera</h2>
        {/* <button onClick={() => setSelectedComponent('Adicionar')}>
          Adicionar Registro
        </button> */}
        {selectedComponent === "Pesquisar" && (
          <Especialidade
            selectedSpecialty={selectedSpecialty}
            onSelectSpecialty={setSelectedSpecialty}
          />
        )}

      </div>

      <div className="pacientes-body">
        <div className="pesquisar-pacientes">
          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
          >
            <option value="Pesquisar">Pesquisar</option>
            <option value="Adicionar">Adicionar</option>
            <option value="Atualizar">Atualizar</option>
          </select>

          {selectedComponent === "Pesquisar" && (
            <PesquisarRegistros setRegistros={setRegistros} especialidade={selectedSpecialty} />
          )}

          {selectedComponent === "Adicionar" && (
            <AdicionarRegistro atualizarRegistros={atualizarRegistros} especialidade={selectedSpecialty} />
          )}

          {selectedComponent === "Atualizar" && (
            <AtualizarRegistro
              registroId={registroSelecionado.id}
              registroInicial={registroSelecionado}
              atualizarRegistros={atualizarRegistros}
            />
          )}
        </div>

        <div className="lista-pacientes">
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
              {registros.map((registro) => (
                <tr
                  key={registro.id}
                  className="paciente-item"
                  onClick={() => handleRegistroClick(registro)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor:
                      registroSelecionado.id === registro.id
                        ? '#f0f8ff'
                        : 'transparent',
                  }}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListaEspera;
