import React, { useState } from 'react';

import './AgendamentosResumo.css';

const AgendamentosResumo = () => {
    const [intervalo, setIntervalo] = useState('hoje'); // Estado inicial: "hoje"
    const [agendamentos, setAgendamentos] = useState([
        { id: 1, nome: 'João Silva', dataHoraInicio: '2024-12-05 08:00', dataHoraFim: '2024-12-05 09:00', sala: 'Sala 1' },
        { id: 2, nome: 'Maria Oliveira', dataHoraInicio: '2024-12-05 10:00', dataHoraFim: '2024-12-05 11:00', sala: 'Sala 2' },
        { id: 3, nome: 'Carlos Souza', dataHoraInicio: '2024-12-06 14:00', dataHoraFim: '2024-12-06 15:00', sala: 'Sala 3' },
        { id: 4, nome: 'Ana Santos', dataHoraInicio: '2024-12-07 16:00', dataHoraFim: '2024-12-07 17:00', sala: 'Sala 1' },
        { id: 5, nome: 'Beatriz Lima', dataHoraInicio: '2024-12-08 09:00', dataHoraFim: '2024-12-08 10:00', sala: 'Sala 2' },
        { id: 6, nome: 'Fernando Almeida', dataHoraInicio: '2024-12-09 11:00', dataHoraFim: '2024-12-09 12:00', sala: 'Sala 3' },
        { id: 7, nome: 'Gabriela Costa', dataHoraInicio: '2024-12-10 13:00', dataHoraFim: '2024-12-10 14:00', sala: 'Sala 1' },
        { id: 8, nome: 'Ricardo Pereira', dataHoraInicio: '2024-12-11 15:00', dataHoraFim: '2024-12-11 16:00', sala: 'Sala 2' },
      ]);

    // Função para alterar o intervalo de agendamentos
    const alterarIntervalo = (novoIntervalo) => {
        setIntervalo(novoIntervalo);
        // Aqui você pode filtrar os dados dinamicamente com base no intervalo selecionado
    };

    return (
        <div className="agendamentos-resumo">
            {/* Header */}
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
                            <th>Nome</th>
                            <th>Data/Hora Início</th>
                            <th>Data/Hora Fim</th>
                            <th>Sala</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agendamentos.map((item) => (
                            <tr key={item.id}>
                                <td>{item.nome}</td>
                                <td>{item.dataHoraInicio}</td>
                                <td>{item.dataHoraFim}</td>
                                <td>{item.sala}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgendamentosResumo;
