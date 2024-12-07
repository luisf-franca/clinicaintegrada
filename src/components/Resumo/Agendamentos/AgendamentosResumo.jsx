import React, { useState, useEffect } from 'react';
import './AgendamentosResumo.css';

// FUNCTIONS
import GetAgendamentos from '../../../functions/Agendamentos/GetAgendamentos';

const AgendamentosResumo = ( {pacienteId, especialidade}) => {
    const [intervalo, setIntervalo] = useState('hoje'); // Estado inicial: "hoje"
    const [agendamentos, setAgendamentos] = useState([]);

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                // Monta o filtro no formato esperado
                const filters = [];
                if (especialidade) filters.push(`especialidade=${especialidade}`);
                if (pacienteId) filters.push(`pacienteId=${pacienteId}`);
                const filterString = filters.length > 0 ? filters.join(',') : null;
                // Chama a função passando o filtro
                const response = await GetAgendamentos({ filter: filterString });
                console.log(response);
                setAgendamentos(response);
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
            }
        };

        // Executa a função ao montar o componente ou alterar os parâmetros
        fetchAgendamentos();
    }, [especialidade, pacienteId]);

    return (
        <div className="agendamentos-resumo">
            <div className="agendamentos-resumo__header">
                <h4>Agendamentos</h4>
            </div>

            {/* Intervalo de agendamentos */}
            <div className="agendamentos-resumo__intervalo">
                <button onClick={() => alterarIntervalo('hoje')} className={intervalo === 'hoje' ? 'active' : ''}>
                    Hoje
                </button>
                <button onClick={() => alterarIntervalo('semana')} className={intervalo === 'semana' ? 'active' : ''}>
                    Esta Semana
                </button>
                <button onClick={() => alterarIntervalo('mes')} className={intervalo === 'mes' ? 'active' : ''}>
                    Este Mês
                </button>
            </div>

            {/* Tabela de agendamentos */}
            <div className="agendamentos-resumo__body">
                <table className="agendamentos-resumo__table">
                    <thead>
                        <tr>
                            <th>Data/Hora Início</th>
                            {/* <th>Data/Hora Fim</th> */}
                            <th>Sala</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agendamentos.map((item) => (
                            <tr key={item.id}>
                                <td>{item.dataHora}</td>
                                {/* <td>{item.dataHoraFim}</td> */}
                                <td>{item.salaId}</td>
                                <button>Visualizar Consulta</button>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgendamentosResumo;
