import React, { useState, useEffect, useCallback } from 'react';

// COMPONENTS
import CreateListaEsperaEntry from '../../functions/ListaEspera/CreateListaEsperaEntry';
import GetPacientes from '../../functions/Pacientes/GetPacientes';
import Especialidade from '../Especialidade/Especialidade';

const AdicionarRegistro = ({ atualizarRegistros, especialidade }) => {
  const [listaEspera, setListaEspera] = useState({
    pacienteId: '',
    dataEntrada: new Date().toISOString().split('T')[0],
    status: 1,
    especialidade: especialidade || localStorage.getItem('selectedSpecialty') || 1,
    prioridade: 1,
  });
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    especialidade || localStorage.getItem('selectedSpecialty') || 1,
  );
  const [step, setStep] = useState(1);
  const [nomePesquisa, setNomePesquisa] = useState('');
  const [debouncedNome, setDebouncedNome] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounce para pesquisa de pacientes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNome(nomePesquisa);
    }, 300);

    return () => clearTimeout(timer);
  }, [nomePesquisa]);

  // Carregar pacientes iniciais quando o componente for montado
  useEffect(() => {
    const carregarPacientesIniciais = async () => {
      setIsLoading(true);
      try {
        const response = await GetPacientes({ pageSize: 3 });

        let pacientesData = [];
        if (response && response.items) {
          pacientesData = response.items;
        } else if (response && Array.isArray(response)) {
          pacientesData = response;
        } else if (response && response.data) {
          pacientesData = response.data;
        }

        setPacientes(pacientesData);
        setShowResults(true);
      } catch (error) {
        console.error('Erro ao carregar pacientes iniciais:', error);
        setPacientes([]);
      } finally {
        setIsLoading(false);
      }
    };

    carregarPacientesIniciais();
  }, []);

  // Buscar pacientes quando o nome debounced mudar
  useEffect(() => {
    const buscarPacientes = async () => {
      setIsLoading(true);
      try {
        const options = { pageSize: 3 }; // Sempre busca 3 resultados

        // Se há texto digitado, adiciona filtro de nome
        if (debouncedNome.trim()) {
          options.filter = `nome^${debouncedNome}`;
        }

        const response = await GetPacientes(options);

        // Verifica se a resposta tem a estrutura esperada
        let pacientesData = [];
        if (response && response.items) {
          pacientesData = response.items;
        } else if (response && Array.isArray(response)) {
          pacientesData = response;
        } else if (response && response.data) {
          pacientesData = response.data;
        }

        setPacientes(pacientesData);
        // Sempre mostra resultados quando há pacientes ou quando não há texto digitado
        if (pacientesData.length > 0 || !debouncedNome.trim()) {
          setShowResults(true);
        }
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        setPacientes([]);
      } finally {
        setIsLoading(false);
      }
    };

    buscarPacientes();
  }, [debouncedNome]);

  useEffect(() => {
    setListaEspera((prevState) => ({
      ...prevState,
      especialidade: selectedSpecialty,
    }));
  }, [selectedSpecialty]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListaEspera((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePacienteSelect = (paciente) => {
    setPacienteSelecionado(paciente);
    setListaEspera((prev) => ({ ...prev, pacienteId: paciente.id }));
    setNomePesquisa(paciente.nome);
    setPacientes([]); // Limpa a lista de sugestões
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { pacienteId, dataEntrada, especialidade, prioridade } =
        listaEspera;
      const listaEsperaData = {
        dataEntrada,
        status: 1,
        especialidade: parseInt(especialidade, 10),
        prioridade: parseInt(prioridade, 10),
      };
      // console.log('listaEsperaData:', listaEsperaData);
      await CreateListaEsperaEntry(pacienteId, listaEsperaData);
      atualizarRegistros();
      setPacienteSelecionado(null);
      setStep(1);
      setNomePesquisa('');
      setListaEspera({
        pacienteId: '',
        dataEntrada: new Date().toISOString().split('T')[0],
        status: 1,
        especialidade: especialidade || localStorage.getItem('selectedSpecialty') || 1,
        prioridade: 1,
      });
    } catch (error) {
      console.error('Erro ao adicionar registro:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div>
              <label htmlFor="nome-pesquisa">Nome do Paciente</label>
              <input
                id="nome-pesquisa"
                type="text"
                value={nomePesquisa}
                onChange={(e) => setNomePesquisa(e.target.value)}
                placeholder="Digite o nome para buscar..."
                autoComplete="off"
              />

              {showResults && !isLoading && !pacienteSelecionado && (
                <div style={{ marginTop: '0.5rem' }}>
                  {pacientes.length > 0 && !pacienteSelecionado ? (
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, border: '1px solid var(--border-color)', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto', backgroundColor: 'var(--branco)', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                      {pacientes.map((paciente) => (
                        <li
                          key={paciente.id}
                          onClick={() => handlePacienteSelect(paciente)}
                          style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s ease' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--background-hover)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          {paciente.nome} - {paciente.telefone}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--cinza)', fontStyle: 'italic' }}>
                      {nomePesquisa.trim() ? 'Nenhum paciente encontrado com esse nome.' : 'Nenhum paciente cadastrado.'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {pacienteSelecionado && (
              <div className="paciente-selecionado-container">
                <div className="paciente-selecionado-card">
                  <h3>Paciente Selecionado</h3>
                  <div className="paciente-selecionado-info">
                    <span className="paciente-nome">{pacienteSelecionado.nome}</span>
                    <span className="paciente-detalhe">Telefone: {pacienteSelecionado.telefone}</span>
                    <span className="paciente-detalhe">Idade: {pacienteSelecionado.idade}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPacienteSelecionado(null);
                      setNomePesquisa('');
                      setListaEspera((prev) => ({ ...prev, pacienteId: '' }));
                    }}
                    className="btn-secondary"
                  >
                    Trocar Paciente
                  </button>
                </div>
              </div>
            )}
          </>
        );

      case 2:
        return (
          <>
            <div>
              <label>Especialidade</label>
              <Especialidade
                selectedSpecialty={selectedSpecialty}
                onSelectSpecialty={setSelectedSpecialty}
              />
            </div>
            <div>
              <label htmlFor="data-entrada">Data de Entrada</label>
              <input
                id="data-entrada"
                type="date"
                name="dataEntrada"
                value={listaEspera.dataEntrada}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* <div>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={listaEspera.status}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione o status</option>
                <option value={1}>Aguardando</option>
                <option value={2}>Atendido</option>
                <option value={3}>Cancelado</option>
              </select>
            </div> */}
            <div>
              <label htmlFor="prioridade">Prioridade</label>
              <select
                id="prioridade"
                name="prioridade"
                value={listaEspera.prioridade}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione a prioridade</option>
                <option value={1}>Baixa</option>
                <option value={2}>Média</option>
                <option value={3}>Alta</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {renderStep()}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((prevStep) => prevStep - 1)}
              className="btn-secondary"
            >
              Voltar
            </button>
          )}
          {step < 2 && pacienteSelecionado && (
            <button
              type="button"
              onClick={() => setStep((prevStep) => prevStep + 1)}
              className="btn-primary"
            >
              Avançar
            </button>
          )}
          {step === 2 && (
            <button type="submit" className="btn-primary">
              Adicionar Registro
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdicionarRegistro;
