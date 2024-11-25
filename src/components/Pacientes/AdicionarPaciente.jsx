import React, { useState } from 'react';

//COMPONENTS
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
            alert('Paciente adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar paciente:', error);
            alert('Erro ao adicionar paciente.');
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
                                <select
                                    name="especialidade"
                                    value={listaEspera.especialidade}
                                    onChange={handleListaEsperaChange}
                                >
                                    <option value="" disabled>
                                        Selecione a especialidade
                                    </option>
                                    <option value="1">Psicologia</option>
                                    <option value="2">Odontologia</option>
                                    <option value="3">Fisioterapia</option>
                                    <option value="4">Nutrição</option>
                                </select>

                                <label>Prioridade:</label>
                                <select
                                    name="prioridade"
                                    value={listaEspera.prioridade}
                                    onChange={handleListaEsperaChange}
                                >
                                    <option value="" disabled>
                                        Selecione a prioridade
                                    </option>
                                    <option value="1">Baixa</option>
                                    <option value="2">Média</option>
                                    <option value="3">Alta</option>
                                </select>
                            </>
                        )}

                        <label>Alguma observação?</label>
                        <input
                            type="text"
                            name="observacao"
                            value={paciente.observacao || ""}
                            onChange={(e) =>
                                setPaciente((prevPaciente) => ({
                                    ...prevPaciente,
                                    observacao: e.target.value,
                                }))
                            }
                        />

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
