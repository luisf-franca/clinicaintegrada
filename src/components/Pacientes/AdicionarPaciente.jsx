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
    // Lógica para pular a etapa do responsável se for maior de idade
    if (step === 1) {
      if (paciente.idade >= 18) {
        setStep(3); // Pula direto para a lista de espera
      } else {
        setStep(2); // Vai para a etapa de cadastro do responsável
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    // Lógica para voltar, pulando a etapa 2 se necessário
    if (step === 3) {
      if (paciente.idade >= 18) {
        setStep(1); // Volta para a etapa inicial
      } else {
        setStep(2); // Volta para a etapa do responsável
      }
    } else {
      setStep((prev) => prev - 1);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const pacienteData = { paciente };
    
    if (desejaListaEspera && listaEspera.especialidade && listaEspera.prioridade) {
        pacienteData.listaEspera = {
            especialidade: parseInt(listaEspera.especialidade, 10),
            prioridade: parseInt(listaEspera.prioridade, 10),
        };
    }

    try {
      await CreatePaciente(pacienteData);
      alert('Paciente adicionado com sucesso!');
      if (onSuccess) onSuccess(); // Chama a função do componente pai para fechar o form e atualizar a lista
    } catch (error) {
      console.error('Erro ao adicionar paciente:', error);
      alert('Erro ao adicionar paciente. Verifique os dados e tente novamente.');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h4>Etapa 1 de 3: Dados Pessoais</h4>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input id="nome" type="text" name="nome" value={paciente.nome} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input id="telefone" type="text" name="telefone" value={paciente.telefone} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="idade">Idade</label>
              <input id="idade" type="number" name="idade" value={paciente.idade} onChange={handleInputChange} required />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h4>Etapa 2 de 3: Informações do Responsável</h4>
            <div className="form-group">
              <label htmlFor="nomeResponsavel">Nome do Responsável</label>
              <input id="nomeResponsavel" type="text" name="nomeResponsavel" value={paciente.nomeResponsavel} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="parentescoResponsavel">Parentesco</label>
              <input id="parentescoResponsavel" type="text" name="parentescoResponsavel" value={paciente.parentescoResponsavel} onChange={handleInputChange} required />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h4>Etapa 3 de 3: Detalhes Adicionais</h4>
            <div className="form-group">
              <label>Deseja incluir na lista de espera?</label>
              <input type="checkbox" checked={desejaListaEspera} onChange={(e) => setDesejaListaEspera(e.target.checked)} />
            </div>
            {desejaListaEspera && (
              <>
                <div className="form-group">
                  <label htmlFor="especialidade">Especialidade</label>
                  <select id="especialidade" name="especialidade" value={listaEspera.especialidade} onChange={handleListaEsperaChange} required>
                    <option value="" disabled>Selecione...</option>
                    <option value="1">Psicologia</option>
                    <option value="2">Odontologia</option>
                    <option value="3">Fisioterapia</option>
                    <option value="4">Nutrição</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="prioridade">Prioridade</label>
                  <select id="prioridade" name="prioridade" value={listaEspera.prioridade} onChange={handleListaEsperaChange} required>
                    <option value="" disabled>Selecione...</option>
                    <option value="1">Baixa</option>
                    <option value="2">Média</option>
                    <option value="3">Alta</option>
                  </select>
                </div>
              </>
            )}
             <div className="form-group">
                <label htmlFor="observacao">Observações</label>
                <textarea id="observacao" name="observacao" value={paciente.observacao} onChange={handleInputChange} rows="3"></textarea>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h3>Adicionar Novo Paciente</h3>
      <form onSubmit={handleSubmit}>
        {renderStepContent()}

        {/* ======================= ÁREA DA CORREÇÃO ======================= */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          {step > 1 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handlePrevStep}
            >
              Voltar
            </button>
          )}

          {/* Botão Avançar - sempre no DOM, mas escondido se não for necessário */}
          <button
            type="button"
            className="btn-primary"
            onClick={handleNextStep}
            disabled={!paciente.nome || !paciente.idade}
            style={{ 
              marginLeft: 'auto',
              display: step < 3 ? 'block' : 'none' // Mostra se a etapa for menor que 3
            }}
          >
            Avançar
          </button>

          {/* Botão Concluir - sempre no DOM, mas escondido se não for necessário */}
          <button
            type="submit"
            className="btn-primary"
            style={{ 
              marginLeft: 'auto',
              display: step === 3 ? 'block' : 'none' // Mostra apenas na etapa 3
            }}
          >
            Concluir Cadastro
          </button>
        </div>
        {/* ===================== FIM DA ÁREA DA CORREÇÃO ===================== */}
      </form>
    </div>
  );
};

export default AdicionarPaciente;