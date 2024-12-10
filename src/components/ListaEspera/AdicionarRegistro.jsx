import React, { useState, useEffect } from 'react';

// COMPONENTS
import CreateListaEsperaEntry from '../../functions/ListaEspera/CreateListaEsperaEntry';
import PesquisarPacientes from '../Pacientes/PesquisarPacientes';
import Especialidade from '../Especialidade/Especialidade';

const AdicionarRegistro = ({ atualizarRegistros }) => {
    const [listaEspera, setListaEspera] = useState({
        pacienteId: '',
        dataEntrada: '',
        status: 1,
        especialidade: localStorage.getItem('selectedSpecialty') || 1,
        prioridade: 0,
    });
    const [pacientes, setPacientes] = useState([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
    const [selectedSpecialty, setSelectedSpecialty] = useState(localStorage.getItem('selectedSpecialty') || 1);
    const [step, setStep] = useState(1); // Controle do passo atual

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { pacienteId, dataEntrada, status, especialidade, prioridade } = listaEspera;
            const listaEsperaData = {
                dataEntrada,
                status: parseInt(status, 10),
                especialidade: parseInt(especialidade, 10),
                prioridade: parseInt(prioridade, 10),
            };
            console.log('listaEsperaData:', listaEsperaData);
            await CreateListaEsperaEntry(pacienteId, listaEsperaData);
            atualizarRegistros();
            setPacienteSelecionado(null);
            setStep(1);
            setListaEspera({
                pacienteId: '',
                dataEntrada: '',
                status: 1,
                especialidade: localStorage.getItem('selectedSpecialty') || 1,
                prioridade: 1,
            });
            alert('Registro adicionado com sucesso!');
        } catch (error) {
            alert(`Erro ao adicionar registro: ${error.response.data}`);
            console.error('Erro ao adicionar registro:', error);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <label>
                            Selecione
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <select
                                    name="pacienteId"
                                    value={listaEspera.pacienteId}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        setPacienteSelecionado(e.target.value);
                                    }}
                                    required
                                >
                                    <option value={null}>Selecione o paciente</option>
                                    {pacientes.map((paciente) => (
                                        <option key={paciente.id} value={paciente.id}>
                                            {paciente.nome}
                                        </option>
                                    ))}
                                </select>

                                {/* Botão para resetar o pacienteSelecionado */}
                                {pacienteSelecionado && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPacienteSelecionado(null);
                                            setListaEspera((prev) => ({ ...prev, pacienteId: '' }));
                                        }}
                                        style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            padding: '4px 8px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Resetar
                                    </button>
                                )}
                            </div>
                        </label>
                        {pacienteSelecionado === null && <PesquisarPacientes setPacientes={setPacientes} />}
                    </>
                );

            case 2:
                return (
                    <>
                        <label>
                            Especialidade
                            <Especialidade
                                selectedSpecialty={selectedSpecialty}
                                onSelectSpecialty={setSelectedSpecialty}
                            />
                        </label>
                        <label>
                            Data de Entrada
                            <input
                                type="date"
                                name="dataEntrada"
                                value={listaEspera.dataEntrada}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Status
                            <select
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
                        </label>
                        <label>
                            Prioridade
                            <select
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
                        </label>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="adicionar-registro">
            <div>
                {/* Renderiza o conteúdo do passo atual */}
                {renderStep()}
                <div className="step-buttons">
                    {/* Botão para voltar */}
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={() => setStep((prevStep) => prevStep - 1)}
                        >
                            Voltar
                        </button>
                    )}
                    {/* Botão para avançar */}
                    {step < 2 && pacienteSelecionado && (
                        <button
                            type="button"
                            onClick={() => setStep((prevStep) => prevStep + 1)}
                        >
                            Avançar
                        </button>
                    )}
                    {/* Botão para submissão no último passo */}
                    {step === 2 && (
                        <button type="button" onClick={handleSubmit}>Adicionar Registro</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdicionarRegistro;