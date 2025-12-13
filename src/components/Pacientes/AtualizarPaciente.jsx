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
      const payload = {
        ...paciente,
        idade: paciente.idade ? parseInt(paciente.idade, 10) : 0,
      };
      await UpdatePaciente(paciente.id, payload);

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
