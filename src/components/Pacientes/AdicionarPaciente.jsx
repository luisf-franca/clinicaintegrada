import React, { useState } from 'react';

// FUNCTIONS
import CreatePaciente from '../../functions/Pacientes/CreatePaciente';

const AdicionarPaciente = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [paciente, setPaciente] = useState({
    nome: '',
    telefone: '',
    idade: '',
    nomeResponsavel: '',
    parentescoResponsavel: '',
    observacao: '',
    recebeuAlta: false,
  });
  const [listaEspera, setListaEspera] = useState({
    especialidade: '',
    prioridade: '',
  });
  const [desejaListaEspera, setDesejaListaEspera] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaciente((prev) => ({
      ...prev,
      [name]: name === 'idade' ? (value ? parseInt(value, 10) : '') : value,
    }));
  };

  const handleListaEsperaChange = (e) => {
    const { name, value } = e.target;
    setListaEspera((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (paciente.idade >= 18) {
        setStep(3);
      } else {
        setStep(2);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (step === 3) {
      if (paciente.idade >= 18) {
        setStep(1);
      } else {
        setStep(2);
      }
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pacienteData = {
      paciente: {
        ...paciente,
        idade: paciente.idade ? parseInt(paciente.idade, 10) : 0,
      },
    };

    if (
      desejaListaEspera &&
      listaEspera.especialidade &&
      listaEspera.prioridade
    ) {
      pacienteData.listaEspera = {
        especialidade: parseInt(listaEspera.especialidade, 10),
        prioridade: parseInt(listaEspera.prioridade, 10),
      };
    }

    try {
      await CreatePaciente(pacienteData);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao adicionar paciente:', error);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input
                id="nome"
                type="text"
                name="nome"
                value={paciente.nome}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                type="text"
                name="telefone"
                value={paciente.telefone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  let maskedValue = value;

                  if (value.length > 2) {
                    maskedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                  }
                  if (value.length > 7) {
                    maskedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                  }

                  handleInputChange({
                    target: {
                      name: "telefone",
                      value: maskedValue
                    }
                  });
                }}
                maxLength={15}
              // placeholder="(99) 99999-9999"
              />
            </div>

            <div className="form-group">
              <label htmlFor="idade">Idade</label>
              <input
                id="idade"
                type="number"
                name="idade"
                value={paciente.idade}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3>Informações do Responsável</h3>

            <div className="form-group">
              <label htmlFor="nomeResponsavel">Nome do Responsável</label>
              <input
                id="nomeResponsavel"
                type="text"
                name="nomeResponsavel"
                value={paciente.nomeResponsavel}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="parentescoResponsavel">Parentesco</label>
              <select
                id="parentescoResponsavel"
                name="parentescoResponsavel"
                value={paciente.parentescoResponsavel}
                onChange={handleInputChange}
              >
                <option value="">Selecione</option>
                <option value="Pai">Pai</option>
                <option value="Mãe">Mãe</option>
                <option value="Filho(a)">Filho(a)</option>
                <option value="Cônjuge">Cônjuge</option>
                <option value="Companheiro(a)">Companheiro(a)</option>
                <option value="Irmão(ã)">Irmão(ã)</option>
                <option value="Avô(ó)">Avô(ó)</option>
                <option value="Neto(a)">Neto(a)</option>
                <option value="Tio(a)">Tio(a)</option>
                <option value="Sobrinho(a)">Sobrinho(a)</option>
                <option value="Primo(a)">Primo(a)</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

          </>
        );
      case 3:
        return (
          <>
            <h3>Detalhes Adicionais</h3>

            <div className="form-group">
              <label
                className="custom-checkbox"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={desejaListaEspera}
                  onChange={(e) => setDesejaListaEspera(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <span
                  className="checkmark"
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '1px solid #aaa',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    background: desejaListaEspera ? '#e6f7e6' : 'var(--branco)',
                  }}
                >
                  {desejaListaEspera ? '✔' : ''}
                </span>
                Incluir na lista de espera?
              </label>
            </div>
            {desejaListaEspera && (
              <>
                <div className="form-group">
                  <label htmlFor="especialidade">Especialidade</label>
                  <select
                    id="especialidade"
                    name="especialidade"
                    value={listaEspera.especialidade}
                    onChange={handleListaEsperaChange}
                    required
                  >
                    <option value="" disabled>
                      Selecione...
                    </option>
                    <option value="1">Psicologia</option>
                    <option value="2">Odontologia</option>
                    <option value="3">Fisioterapia</option>
                    <option value="4">Nutrição</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="prioridade">Prioridade</label>
                  <select
                    id="prioridade"
                    name="prioridade"
                    value={listaEspera.prioridade}
                    onChange={handleListaEsperaChange}
                    required
                  >
                    <option value="" disabled>
                      Selecione...
                    </option>
                    <option value="1">Baixa</option>
                    <option value="2">Média</option>
                    <option value="3">Alta</option>
                  </select>
                </div>
              </>
            )}
            <div className="form-group">
              <label htmlFor="observacao">Observações</label>
              <textarea
                id="observacao"
                name="observacao"
                value={paciente.observacao}
                onChange={handleInputChange}
                rows="3"
              ></textarea>
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
        {renderStepContent()}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '2rem',
          }}
        >
          {step > 1 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handlePrevStep}
            >
              Voltar
            </button>
          )}

          <button
            type="button"
            className="btn-primary"
            onClick={handleNextStep}
            disabled={!paciente.nome}
            style={{
              marginLeft: 'auto',
              display: step < 3 ? 'block' : 'none',
            }}
          >
            Avançar
          </button>

          <button
            type="submit"
            className="btn-primary"
            style={{
              marginLeft: 'auto',
              display: step === 3 ? 'block' : 'none',
            }}
          >
            Concluir Cadastro
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdicionarPaciente;
