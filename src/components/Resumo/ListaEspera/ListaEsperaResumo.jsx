import React, { useState, useEffect } from 'react';
import './ListaEsperaResumo.css';
import { useNavigate } from 'react-router-dom'; // Import necessário para navegação

// FUNCTIONS
import GetListaEspera from '../../../functions/ListaEspera/GetListaEntries';
import FormatarDateTimeToLocal from '../../../functions/FormatarDateTime/FormatDateTimeToLocal';


const ListaEsperaResumo = ({ pacienteId, especialidade }) => {
    const [listaEspera, setListaEspera] = useState([]);
    const [pacienteFilter, setPacienteFilter] = useState(pacienteId);
    const navigate = useNavigate(); // Hook para navegação

    // atualiza a lista de espera ao montar o componente, com os parâmetros opcionais pacienteId e especialidade
    useEffect(() => {
        const fetchListaEspera = async () => {
            try {
                // Monta o filtro no formato esperado
                const filters = [];
                if (especialidade) filters.push(`especialidade=${especialidade}`);
                if (pacienteFilter) filters.push(`pacienteId=${pacienteFilter}`);
                filters.push('status=1'); // Apenas registros aguardando
                const filterString = filters.length > 0 ? filters.join(',') : null;

                // Chama a função passando o filtro
                const response = await GetListaEspera({ filter: filterString, orderBy: 'dataEntrada' });
                setListaEspera(response);
            } catch (error) {
                console.error('Erro ao buscar lista de espera:', error);
            }
        };

        // Executa a função ao montar o componente ou alterar os parâmetros
        fetchListaEspera();
    }, [especialidade, pacienteFilter]);

    // Define a mensagem apropriada
    const getEmptyMessage = () => {
        if (pacienteId && listaEspera.length === 0) {
            return 'Nenhum registro não concluído para o paciente selecionado, considere cadastrar um novo registro.';
        }
        if (!pacienteId && listaEspera.length === 0) {
            return 'Nenhum registro não concluído encontrado, considere cadastrar um novo registro.';
        }
        return null;
    };

    // Função para redirecionar para a tela de cadastro de registro na lista de espera
    const handleCadastrarRegistroListaEspera = () => {
        //Caso o pacienteId esteja definido, redirecionar para a tela de cadastro com o pacienteId preenchido
        if (pacienteId && listaEspera.length === 0) {
            // console.log('pacienteId:', pacienteId);
            navigate(`/listaespera?pacienteId=${pacienteId}`); // Navegação com query string
        }
        //Caso contrário, redirecionar para a tela de cadastro sem preenchimento
        else {
            navigate('/listaespera'); // Navegação sem query string
        }
    }

    const handleAgendarConsulta = (registroId) => {
        navigate(`/agendamento?agendamentoId=${registroId}`); // Navegação com query string
    }



    return (
        <div className="lista-espera-resumo">
            <div className="lista-espera-resumo__header">
                <h4>Lista de Espera</h4>
                <button onClick={handleCadastrarRegistroListaEspera}>Novo Registro</button>
            </div>

            <div className="lista-espera-resumo__body">
                <table className="lista-espera-resumo__table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Data Entrada</th>
                            <th>Prioridade</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaEspera.length > 0 ? (
                            listaEspera.slice(0, 4).map((item) => (
                                <tr key={item.id}>
                                    <td>{item.nome}</td>
                                    <td>{FormatarDateTimeToLocal(item.dataEntrada)}</td>
                                    <td>{item.prioridade}</td>
                                    <td>
                                        <button onClick={() => handleAgendarConsulta(item.id)}>Agendar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="lista-espera-resumo__empty">
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

export default ListaEsperaResumo;
