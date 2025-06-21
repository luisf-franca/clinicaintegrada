import React, { useState, useEffect, useCallback } from 'react';
import '../styles/pacientes.css'; // Seu CSS atualizado

// COMPONENTS
import PesquisarPacientes from '../components/Pacientes/PesquisarPacientes';
import AdicionarPaciente from '../components/Pacientes/AdicionarPaciente';
import AtualizarPaciente from '../components/Pacientes/AtualizarPaciente';

// FUNCTIONS
import GetPacientes from '../functions/Pacientes/GetPacientes';
import DeletePaciente from '../functions/Pacientes/DeletePaciente';

const Pacientes = () => {
  const [view, setView] = useState('list'); // 'list', 'add', 'update'
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Usar useCallback para evitar recriações desnecessárias da função
  const atualizarListaPacientes = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await GetPacientes();
      setPacientes(items);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      alert('Falha ao carregar a lista de pacientes.');
    } finally {
      setIsLoading(false);
    }
  }, []); // Array de dependências vazio, a função não muda

  useEffect(() => {
    atualizarListaPacientes();
  }, [atualizarListaPacientes]);

  const handlePacienteClick = (paciente) => {
    setPacienteSelecionado(paciente);
    setView('update');
  };

  const handleDeletePaciente = async (pacienteId) => {
    // e.stopPropagation() é necessário se o botão estiver dentro da linha <tr>
    const confirmDelete = window.confirm(
      'Tem certeza que deseja deletar? Todos os registros desse paciente serão perdidos.',
    );
    if (confirmDelete) {
      try {
        await DeletePaciente(pacienteId);
        alert('Paciente deletado com sucesso!');
        // Se a view de atualização estava aberta para o paciente deletado, volte para a lista
        if (pacienteSelecionado && pacienteSelecionado.id === pacienteId) {
            setView('list');
            setPacienteSelecionado(null);
        }
        atualizarListaPacientes();
      } catch (error) {
        console.error('Erro ao deletar paciente:', error);
        alert('Erro ao deletar paciente.');
      }
    }
  };
  
  // Função para renderizar o painel lateral (formulário)
  const renderFormPanel = () => {
    switch(view) {
        case 'add':
            return <AdicionarPaciente onSuccess={() => { setView('list'); atualizarListaPacientes(); }} />;
        
        case 'update':
            // --- INÍCIO DA ALTERAÇÃO ---
            // Se a view for 'update', mas nenhum paciente estiver selecionado,
            // exiba uma mensagem em vez de renderizar o formulário.
            if (!pacienteSelecionado) {
              return (
                <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
                  <p style={{ color: 'var(--cinza)', marginTop: '1rem' }}>
                    Por favor, pesquise e selecione um paciente na lista ao lado para editar as informações.
                  </p>
                </div>
              );
            }
            // Se houver um paciente selecionado, renderize o formulário de atualização.
            return <AtualizarPaciente 
                      pacienteInicial={pacienteSelecionado} 
                      onSuccess={() => { setView('list'); setPacienteSelecionado(null); atualizarListaPacientes(); }} 
                   />;
            // --- FIM DA ALTERAÇÃO ---

        default: // 'list'
            return <PesquisarPacientes setPacientes={setPacientes} />;
    }
  }

  return (
    <div className="pacientes">
      <div className="pacientes-header">
        <h2>Gestão de Pacientes</h2>
        <button className="btn-primary" onClick={() => setView('add')}>
          Adicionar Paciente
        </button>
      </div>

      {/* Aqui deve conter três botões colados no topo do form, um ao lado do outro */}
      <div className="pacientes-body">
        <div className="form-container">
          <div className="pacientes-actions">
            <button className={`btn-secondary ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
              Pesquisar 🔎
            </button>
            <button className={`btn-secondary ${view === 'add' ? 'active' : ''}`} onClick={() => setView('add')}>
              Adicionar ➕
            </button>
            <button className={`btn-secondary ${view === 'update' ? 'active' : ''}`} onClick={() => setView('update')}>
              Alterar 🖊
            </button>
          </div>
          {renderFormPanel()}
        </div>

        <div className="lista-pacientes">
          <table className="pacientes-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Idade</th>
                <th>Alta</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5">Carregando...</td>
                </tr>
              ) : (
                pacientes.map((paciente) => (
                  <tr
                    key={paciente.id}
                    className={pacienteSelecionado?.id === paciente.id ? 'selected' : ''}
                    onClick={() => handlePacienteClick(paciente)}
                  >
                    <td>{paciente.nome}</td>
                    <td>{paciente.telefone}</td>
                    <td>{paciente.idade}</td>
                    <td>{paciente.recebeuAlta ? 'Sim' : 'Não'}</td>
                    <td>
                      <button
                        className="btn-danger"
                        onClick={(e) => {
                          e.stopPropagation(); // Impede que o onClick da <tr> seja disparado
                          handleDeletePaciente(paciente.id);
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

export default Pacientes;