import React, { useState, useEffect } from 'react';

// COMPONENTS
import UpdateListaEsperaEntry from '../../functions/ListaEspera/UpdateListaEsperaEntry';

const AtualizarRegistro = ({ registroId, registroInicial, atualizarRegistros }) => {
    const [listaEspera, setListaEspera] = useState(registroInicial || {});
    const [paciente, setPaciente] = useState({
        nome: registroInicial.nome,
    });

    useEffect(() => {
        console.log('Registro inicial:', registroInicial);
        if (registroInicial) {
            const formatDate = (date) => {
                if (!date) return ''; // Se a data for null, retorne string vazia
                return date.split('T')[0]; // Pegue apenas a parte da data no formato YYYY-MM-DD
            };

            setPaciente({
                nome: registroInicial.nome,
            });

            setListaEspera({
                dataEntrada: formatDate(registroInicial.dataEntrada),
                dataSaida: formatDate(registroInicial.dataSaida),
                pacienteId: registroInicial.pacienteId,
                prioridade: registroInicial.prioridadeInt,
                especialidade: registroInicial.especialidadeInt,
                status: registroInicial.statusInt,
            });
        }
    }, [registroInicial, registroId]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setListaEspera((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            console.log('Registro a ser atualizado:', registroId);
            await UpdateListaEsperaEntry(registroId, listaEspera);
            atualizarRegistros();
            alert('Registro atualizado com sucesso!');
        } catch (error) {
            alert('Registro atualizado com sucesso!');
            atualizarRegistros();
            console.error('Erro ao atualizar registro:', error);
        }
    };

    return (
        <>
            <label>
                Paciente
                <input
                    type="text"
                    value={paciente.nome || 'Nome não disponível'}
                    readOnly
                    style={{
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        border: 'none',
                        padding: '5px',
                    }}
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
                Data de Saída
                <input
                    type="date"
                    name="dataSaida"
                    value={listaEspera.dataSaida}
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
            <button onClick={handleSubmit}>Atualizar Registro</button>
        </>
    );
}

export default AtualizarRegistro;