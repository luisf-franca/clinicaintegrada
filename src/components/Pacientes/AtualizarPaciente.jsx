import { useEffect, useState } from 'react';

// COMPONENTS
import UpdatePaciente from '../../functions/Pacientes/UpdatePaciente';

const AtualizarPaciente = ({ pacienteInicial, onSuccess }) => {
  const [paciente, setPaciente] = useState(pacienteInicial);
  const [step, setStep] = useState(1);

  useEffect(() => {
    setPaciente(pacienteInicial);
    setStep(1);
  }, [pacienteInicial]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaciente((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UpdatePaciente(paciente.id, paciente);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3>Dados Pessoais</h3>

            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                type="text"
                name="nome"
                value={paciente.nome}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                type="text"
                name="telefone"
                value={paciente.telefone}
                onChange={handleInputChange}
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
                  name="recebeuAlta"
                  checked={paciente.recebeuAlta}
                  onChange={handleInputChange}
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
                    background: paciente.recebeuAlta
                      ? '#e6f7e6'
                      : 'var(--branco)',
                  }}
                >
                  {paciente.recebeuAlta ? '✔' : ''}
                </span>
                Paciente já recebeu alta
              </label>
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
                value={paciente.nomeResponsavel || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="parentescoResponsavel">
                Parentesco do Responsável
              </label>
              <input
                id="parentescoResponsavel"
                type="text"
                name="parentescoResponsavel"
                value={paciente.parentescoResponsavel || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="observacao">Observações</label>
              <textarea
                id="observacao"
                name="observacao"
                value={paciente.observacao || ''}
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
    <div className="atualizar-paciente-form">
      <form onSubmit={handleSubmit}>
        {renderStep()}

        <div className="form-navigation">
          {step > 1 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setStep((prevStep) => prevStep - 1)}
            >
              Voltar
            </button>
          )}

          {step < 2 && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setStep((prevStep) => prevStep + 1)}
              style={{ marginLeft: 'auto' }}
            >
              Avançar
            </button>
          )}

          {step === 2 && (
            <button
              type="submit"
              className="btn-primary"
              style={{ marginLeft: 'auto' }}
            >
              Salvar Alterações
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AtualizarPaciente;
