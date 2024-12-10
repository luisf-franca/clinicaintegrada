import React, { useState, useEffect } from 'react';
import './ConsultaResumo.css';
import { useNavigate } from 'react-router-dom'; // Import necessário para navegação

// FUNCTIONS
import GetConsultas from '../../../functions/Consultas/GetConsultas';
import FormatarDateTimeToLocal from '../../../functions/FormatarDateTime/FormatDateTimeToLocal';
import IniciarTriagem from '../../../functions/Consultas/IniciarTriagem';
import FinalizarTriagem from '../../../functions/Consultas/FinalizarTriagem';
import IniciarConsulta from '../../../functions/Consultas/IniciarConsulta';
import FinalizarConsulta from '../../../functions/Consultas/FinalizarConsulta';

const ConsultaResumo = ({ pacienteId, especialidade }) => {
    const [consultas, setConsultas] = useState([]);
    const [pacienteFilter, setPacienteFilter] = useState(pacienteId);
    const [atualizarRegistros, setAtualizarRegistros] = useState(false);
    const navigate = useNavigate(); // Hook para navegação

    // autaliza as consultas ao montar o componente, com os parâmetros opcionais pacienteId e especialidade
    useEffect(() => {
        const fetchConsultas = async () => {
            try {
                // Monta o filtro no formato esperado
                const filters = [];
                if (especialidade) filters.push(`especialidade=${especialidade}`);
                if (pacienteFilter) filters.push(`pacienteId=${pacienteFilter}`);
                const filterString = filters.length > 0 ? filters.join(',') : null;

                // Chama a função passando o filtro
                const response = await GetConsultas({ filter: filterString });
                // console.log('Consultas:', response);
                setConsultas(response);
            } catch (error) {
                console.error('Erro ao buscar consultas:', error);
            }
        };

        // Executa a função ao montar o componente ou alterar os parâmetros
        fetchConsultas();
    }, [especialidade, pacienteFilter, atualizarRegistros]);

    const getEmptyMessage = () => {
        if (pacienteId && consultas.length === 0) {
            return 'Nenhum registro encontrado para o paciente selecionado, considere cadastrar um novo registro.';
        }
        if (!pacienteId && consultas.length === 0) {
            return 'Nenhum registro encontrado, considere cadastrar um novo registro.';
        }
        return null;
    }

    const handleCadastrarConsulta = () => {
        navigate('/agendamento');
    }

    const handleNavigateConsulta = (consultaId) => {
        navigate(`/consulta?${consultaId}`);
    }

    const handleAtualizarRegistros = () => {
        setAtualizarRegistros(!atualizarRegistros);
    }

    const renderButton = ({ status, tipo, id }) => {
        if (status === "Agendada" && tipo === 1) {
            return <button onClick={() => handleAction('iniciar-triagem', id)}>Iniciar Triagem</button>;
        }

        if (status === "Triagem" && tipo === 1) {
            return <button onClick={() => handleAction('finalizar-triagem', id)}>Finalizar Triagem</button>;
        }

        if (
            (status === "AguardandoConsulta" && tipo === 1) ||
            (status === "Agendada" && tipo === 2)
        ) {
            return <button onClick={() => handleAction('iniciar-consulta', id)}>Iniciar Consulta</button>;
        }

        if (
            (status === "EmAndamento" && tipo === 1) ||
            (status === "EmAndamento" && tipo === 2)
        ) {
            return <button onClick={() => handleAction('finalizar-consulta', id)}>Finalizar Consulta</button>;
        }

        if (status === "Concluida") {
            return <button onClick={() => handleAction('visualizar-consulta', id)}>Visualizar Consulta</button>;
        }

        return null; // Caso nenhuma condição seja atendida
    };

    const handleAction = async (action, consultaId) => {
        const confirmMessage = {
            'iniciar-triagem': 'Tem certeza que deseja iniciar a triagem?',
            'finalizar-triagem': 'Tem certeza que deseja finalizar a triagem?',
            'iniciar-consulta': 'Tem certeza que deseja iniciar a consulta?',
            'finalizar-consulta': 'Tem certeza que deseja finalizar a consulta?',
        };

        if (confirmMessage[action] && !window.confirm(confirmMessage[action])) {
            return;
        }

        switch (action) {
            case 'iniciar-triagem':
                await IniciarTriagem(consultaId);
                handleAtualizarRegistros();
                break;
            case 'finalizar-triagem':
                await FinalizarTriagem(consultaId);
                handleAtualizarRegistros();
                break;
            case 'iniciar-consulta':
                await IniciarConsulta(consultaId);
                handleAtualizarRegistros();
                break;
            case 'finalizar-consulta':
                await FinalizarConsulta(consultaId);
                handleAtualizarRegistros();
                break;
            case 'visualizar-consulta':
                handleNavigateConsulta(consultaId);
                handleAtualizarRegistros();
                break;
            default:
                console.log(`Ação desconhecida: ${action}`);
        }
    };

    return (
        <div className="consulta-resumo">
            <div className="consulta-resumo__header">
                <h2>Consultas</h2>
                <button onClick={handleCadastrarConsulta} className="btn-cadastrar-consulta">Novo Registro</button>
            </div>

            <div className='consulta-resumo__body'>
                <table className="consulta-resumo__table">
                    <thead>
                        <tr>
                            <th>Data Início</th>
                            <th>Data Fim</th>
                            <th>Status</th>
                            <th>Observação</th>
                            <th>Especialidade</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consultas.length > 0 ? (
                            consultas.map(({ id, dataHoraInicio, dataHoraFim, especialidade, status, observacao, tipo }) => (
                                <tr key={id}>
                                    <td>{FormatarDateTimeToLocal(dataHoraInicio)}</td>
                                    <td>{FormatarDateTimeToLocal(dataHoraFim)}</td>
                                    <td>{status}</td>
                                    <td>{observacao}</td>
                                    <td>{especialidade}</td>
                                    <td>
                                        {renderButton({ status, tipo, id })}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan='6' className='consulta-resumo__empty'>
                                    {getEmptyMessage()}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {pacienteFilter && (
                    <div className="agendamentos-resumo__filtro">
                        <span>Filtrando por paciente selecionado</span>
                        <button onClick={() => setPacienteFilter(null)}>Mostrar Tudo</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsultaResumo;