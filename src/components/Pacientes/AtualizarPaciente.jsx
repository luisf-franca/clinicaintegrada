import React, { useEffect, useState } from 'react';

// COMPONENTS
import UpdatePaciente from '../../functions/Pacientes/UpdatePaciente';

const AtualizarPaciente = ({ pacienteInicial, onSuccess }) => {
  // Inicializa o estado do formulário com os dados do paciente selecionado
  const [paciente, setPaciente] = useState(pacienteInicial);
  const [step, setStep] = useState(1);

  // Efeito para atualizar o formulário se o paciente selecionado mudar
  useEffect(() => {
    setPaciente(pacienteInicial);
    setStep(1); // Reseta para a primeira etapa ao selecionar um novo paciente
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
      // alert('Paciente atualizado com sucesso!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      // alert('Erro ao atualizar paciente.');
    }
  };

  // =================================================================
  // A LÓGICA DE RENDERIZAÇÃO FOI ESTRUTURADA COMO EM AdicionarPaciente
  // =================================================================
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            {/* Título da etapa */}
            <h3>Dados Pessoais</h3>
            {/* <br /> */}
            {/* Usa a classe "form-group" para cada campo */}
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

            {/* Checkbox estilizado seguindo o padrão do AdicionarPaciente */}
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
                    background: paciente.recebeuAlta ? '#e6f7e6' : '#fff',
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
            {/* Título da etapa */}
            <h3>Informações do Responsável</h3>
            {/* <br /> */}
            {/* Esta parte já estava quase correta, apenas ajustando */}
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
    // Um container principal para o formulário
    <div className="atualizar-paciente-form">
      {/* <h3>Alterar Paciente</h3> */}
      <form onSubmit={handleSubmit}>
        {renderStep()}

        {/* ======================================================== */}
        {/* BOTÕES DE NAVEGAÇÃO COM AS CLASSES CSS CORRETAS */}
        {/* ======================================================== */}
        <div className="form-navigation">
          {step > 1 && (
            <button
              type="button"
              className="btn-secondary" // Classe para botão de voltar
              onClick={() => setStep((prevStep) => prevStep - 1)}
            >
              Voltar
            </button>
          )}

          {step < 2 && (
            <button
              type="button"
              className="btn-primary" // Classe para botão principal
              onClick={() => setStep((prevStep) => prevStep + 1)}
              style={{ marginLeft: 'auto' }} // Garante que o botão fique à direita
            >
              Avançar
            </button>
          )}

          {step === 2 && (
            <button
              type="submit"
              className="btn-primary" // Classe para botão principal
              style={{ marginLeft: 'auto' }} // Garante que o botão fique à direita
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
