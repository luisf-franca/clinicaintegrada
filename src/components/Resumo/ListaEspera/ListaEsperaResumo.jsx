import React, { useState } from 'react';
import './ListaEsperaResumo.css';

const ListaEsperaResumo = () => {
    // Estado inicial com dados fictícios
    const [listaEspera, setListaEspera] = useState([
        { id: 1, nome: 'João Silva', prioridade: 'Alta', dataEntrada: '2024-12-01' },
        { id: 2, nome: 'Maria Oliveira', prioridade: 'Média', dataEntrada: '2024-12-02' },
        { id: 3, nome: 'Carlos Souza', prioridade: 'Baixa', dataEntrada: '2024-12-03' },
        { id: 4, nome: 'Ana Santos', prioridade: 'Alta', dataEntrada: '2024-12-04' },
        { id: 5, nome: 'Fernanda Costa', prioridade: 'Média', dataEntrada: '2024-12-05' },
    ]);

    return (
        <div className="lista-espera-resumo">
            {/* Header com classe para estilização */}
            <div className="lista-espera-resumo__header">
                <h4>Lista de Espera</h4>
            </div>

            {/* Tabela para exibir os registros */}
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
                        {listaEspera.slice(0, 4).map((item) => (
                            <tr key={item.id}>
                                <td>{item.nome}</td>
                                <td>{item.dataEntrada}</td>
                                <td>{item.prioridade}</td>
                                <button>Agendar</button>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaEsperaResumo;
