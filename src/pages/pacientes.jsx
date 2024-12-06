import React, { useState, useEffect } from 'react';
import '../styles/pacientes.css';

// COMPONENTS
import PesquisarPacientes from '../components/Pacientes/PesquisarPacientes';
import GetPacientes from '../functions/Pacientes/GetPacientes';
import AdicionarPaciente from '../components/Pacientes/AdicionarPaciente';
import AtualizarPaciente from '../components/Pacientes/AtualizarPaciente';
import DeletePaciente from '../functions/Pacientes/DeletePaciente';

const Pacientes = () => {
  const [selectedComponent, setSelectedComponent] = useState('Pesquisar');
  const [pacienteSelecionado, setPacienteSelecionado] = useState({});
  const [pacientes, setPacientes] = useState([]);

  const atualizarListaPacientes = async () => {
    try {
      const items = await GetPacientes();
      setPacientes(items);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
    }
  };

  const handlePacienteClick = (paciente) => {
    setPacienteSelecionado(paciente);
    setSelectedComponent('Atualizar');
  };

  const handleDeletePaciente = async (pacienteId) => {
    const confirmDelete = window.confirm(
      'Tem certeza que deseja deletar o paciente?',
    );
    if (confirmDelete) {
      try {
        await DeletePaciente(pacienteId);
        alert('Paciente deletado com sucesso!');
        atualizarListaPacientes(); // Atualiza a lista após deletar
      } catch (error) {
        console.error('Erro ao deletar paciente:', error);
        alert('Erro ao deletar paciente.');
      }
    } else {
      alert('Ação cancelada.');
    }
  };

  useEffect(() => {
    atualizarListaPacientes();
  }, []);

  return (
    <div className="pacientes">
      <div className="pacientes-header">
        <h2>Pacientes</h2>
        <button onClick={() => setSelectedComponent('Adicionar')}>
          Adicionar Paciente
        </button>
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

          {selectedComponent === 'Pesquisar' && (
            <PesquisarPacientes setPacientes={setPacientes} />
          )}
          {selectedComponent === 'Adicionar' && (
            <AdicionarPaciente
              atualizarListaPacientes={atualizarListaPacientes}
            />
          )}
          {selectedComponent === 'Atualizar' && (
            <AtualizarPaciente
              pacienteId={pacienteSelecionado.id}
              pacienteInicial={pacienteSelecionado}
              atualizarListaPacientes={atualizarListaPacientes}
            />
          )}
        </div>

        <div className="lista-pacientes">
          <table className="pacientes-table">
            <thead className="header-lista">
              <tr>
                <th>Nome</th>
                <th>Idade</th>
                <th>Telefone</th>
                <th>Observação</th>
                <th>Recebeu Alta</th>
                <th>Nome Responsável</th>
                <th>Parentesco Responsável</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody className="body-lista">
              {pacientes.map((paciente) => (
                <tr
                  key={paciente.id}
                  className="paciente-item"
                  onClick={() => handlePacienteClick(paciente)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor:
                      pacienteSelecionado.id === paciente.id
                        ? '#f0f8ff'
                        : 'transparent',
                  }}
                >
                  <td>{paciente.nome}</td>
                  <td>{paciente.idade}</td>
                  <td>{paciente.telefone}</td>
                  <td>{paciente.observacao}</td>
                  <td>{paciente.recebeuAlta ? 'Sim' : 'Não'}</td>
                  <td>{paciente.nomeResponsavel}</td>
                  <td>{paciente.parentescoResponsavel}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePaciente(paciente.id);
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

export default Pacientes;
