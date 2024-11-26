import React, { useEffect, useState } from 'react';

// COMPONENTS
import UpdatePaciente from '../../functions/Pacientes/UpdatePaciente';

const AtualizarPaciente = ({ pacienteId, pacienteInicial, atualizarListaPacientes }) => {
    const [step, setStep] = useState(1); // Controle da etapa atual
    const [paciente, setPaciente] = useState(pacienteInicial || {});



    useEffect(() => {
        const { id, ...rest } = pacienteInicial;
        setPaciente(rest);
    }, [pacienteInicial, pacienteId]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPaciente((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : name === 'idade' ? parseInt(value, 10) || '' : value,
        }));
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await UpdatePaciente(pacienteId, paciente);
            console.log('Paciente atualizado com sucesso:', response);
            alert('Paciente atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar paciente:', error);
            alert('Paciente atualizado com sucesso!');
            await atualizarListaPacientes(); // Atualiza a lista
        }
    };


    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <label>Nome:</label>
                        <input
                            type="text"
                            name="nome"
                            value={paciente.nome}
                            onChange={handleInputChange}
                        />

                        <label>Telefone:</label>
                        <input
                            type="text"
                            name="telefone"
                            value={paciente.telefone}
                            onChange={handleInputChange}
                        />

                        <label>Idade:</label>
                        <input
                            type="number"
                            name="idade"
                            value={paciente.idade}
                            onChange={handleInputChange}
                        />

                        <label>Recebeu Alta:</label>
                        <input
                            type="checkbox"
                            name="recebeuAlta"
                            checked={paciente.recebeuAlta}
                            onChange={handleInputChange}
                        />
                    </>
                );
            case 2:
                return (
                    <>
                        <label>Nome do Responsável:</label>
                        <input
                            type="text"
                            name="nomeResponsavel"
                            value={paciente.nomeResponsavel || ''}
                            onChange={handleInputChange}
                        />

                        <label>Parentesco do Responsável:</label>
                        <input
                            type="text"
                            name="parentescoResponsavel"
                            value={paciente.parentescoResponsavel || ''}
                            onChange={handleInputChange}
                        />

                        <label>Observação:</label>
                        <input
                            type="text"
                            name="observacao"
                            value={paciente.observacao || ''}
                            onChange={handleInputChange}
                        />
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
                    {step < 2 && (
                        <button type="button" onClick={() => setStep((prevStep) => prevStep + 1)}>
                            Avançar
                        </button>
                    )}
                    {step === 2 && <button type="submit">Salvar Alterações</button>}
                </div>
            </form>
        </div>
    );
};

export default AtualizarPaciente;
