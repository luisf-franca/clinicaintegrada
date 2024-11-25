import React, { useState } from 'react';
import CreatePaciente from '../../functions/Pacientes/CreatePaciente';

const AdicionarPaciente = () => {
  const [step, setStep] = useState(1); // Estado para controlar a etapa atual
  const [paciente, setPaciente] = useState({
    nome: '',
    telefone: '',
    idade: null,
    nomeResponsavel: '',
    parentescoResponsavel: '',
    observacao: '',
    recebeuAlta: false,
  });
  const [listaEspera, setListaEspera] = useState({
    especialidade: '',
    prioridade: '',
  });
  const [desejaResponsavel, setDesejaResponsavel] = useState(false);
  const [desejaListaEspera, setDesejaListaEspera] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaciente((prevData) => ({
      ...prevData,
      [name]: name === 'idade' ? parseInt(value, 10) || '' : value, // Converte para inteiro se for o campo idade
    }));
  };
  

  const handleListaEsperaChange = (e) => {
    const { name, value } = e.target;
    setListaEspera((prevData) => ({
      ...prevData,
      [name]: ['prioridade', 'especialidade'].includes(name) ? parseInt(value, 10) || '' : value, // Converte para inteiro
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pacienteData = { paciente };
    if (desejaListaEspera && (listaEspera.especialidade || listaEspera.prioridade)) {
      pacienteData.listaEspera = listaEspera;
    }
    try {
      const response = await CreatePaciente(pacienteData);
      console.log('Paciente adicionado com sucesso:', response);
    } catch (error) {
      console.error('Erro ao adicionar paciente:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label>Nome:</label>
            <input type="text" name="nome" value={paciente.nome} onChange={handleInputChange} />

            <label>Telefone:</label>
            <input type="text" name="telefone" value={paciente.telefone} onChange={handleInputChange} />

            <label>Idade:</label>
            <input type="number" name="idade" value={paciente.idade} onChange={handleInputChange} />
          </>
        );
      case 2:
        return (
          <>
            <label>Deseja cadastrar um responsável?</label>
            <input
              type="checkbox"
              checked={desejaResponsavel}
              onChange={(e) => setDesejaResponsavel(e.target.checked)}
            />
            {desejaResponsavel && (
              <>
                <label>Nome Responsável:</label>
                <input
                  type="text"
                  name="nomeResponsavel"
                  value={paciente.nomeResponsavel}
                  onChange={handleInputChange}
                />

                <label>Parentesco Responsável:</label>
                <input
                  type="text"
                  name="parentescoResponsavel"
                  value={paciente.parentescoResponsavel}
                  onChange={handleInputChange}
                />
              </>
            )}
          </>
        );
      case 3:
        return (
          <>
            <label>Deseja cadastrar na lista de espera?</label>
            <input
              type="checkbox"
              checked={desejaListaEspera}
              onChange={(e) => setDesejaListaEspera(e.target.checked)}
            />
            {desejaListaEspera && (
              <>
                <label>Especialidade:</label>
                <input
                  type="number"
                  name="especialidade"
                  value={listaEspera.especialidade}
                  onChange={handleListaEsperaChange}
                />

                <label>Prioridade:</label>
                <input
                  type="number"
                  name="prioridade"
                  value={listaEspera.prioridade}
                  onChange={handleListaEsperaChange}
                />
              </>
            )}
            <button type="submit">Concluir Cadastro</button>
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
        <div>
          {step > 1 && (
            <button type="button" onClick={() => setStep((prevStep) => prevStep - 1)}>
              Voltar
            </button>
          )}
          {step < 3 && (
            <button type="button" onClick={() => setStep((prevStep) => prevStep + 1)}>
              Avançar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdicionarPaciente;
