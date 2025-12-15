import React, { useState, useEffect } from 'react';
import './RelatorioResumo.css';
import { useNavigate } from 'react-router-dom';
import GetRelatorios from '../../../functions/Relatorios/GetRelatorios';

const RelatorioResumo = () => {
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetRelatorios();
                setDados(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Subcomponente para Item de Métrica
    const MetricItem = ({ label, value, subValue, subLabel }) => (
        <div className="metric-item">
            <span className="metric-label">{label}</span>
            <div className="metric-value-row">
                <span className="metric-number">{value}</span>
                {subValue > 0 && (
                    <span className="metric-badge">+{subValue} {subLabel}</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="relatorio-resumo">
            <div
                className="widget-header"
                title="Ver relatórios completos"
            >
                <h4>Relatório Mensal</h4>
            </div>

            <div className="relatorio-body">
                {loading ? (
                    <div className="loading-state">Carregando dados...</div>
                ) : dados ? (
                    <div className="metrics-grid">
                        <MetricItem
                            label="Pacientes"
                            value={dados.pacientesCadastrados}
                            subValue={dados.pacientesCadastradosEsteMes}
                            subLabel="este mês"
                        />
                        <MetricItem
                            label="Agendamentos"
                            value={dados.agendamentosRealizados}
                            subValue={dados.agendamentosRealizadosEsteMes}
                            subLabel="este mês"
                        />
                        <MetricItem
                            label="Consultas"
                            value={dados.consultasConcluidas}
                            subValue={dados.consultasConcluidasEsteMes}
                            subLabel="estemês"
                        />
                        <div className="metric-item">
                            <span className="metric-label">Equipes</span>
                            <div className="metric-value-row">
                                <span className="metric-number">{dados.equipesCadastradas}</span>
                                <span className="metric-detail">Equipes</span>
                            </div>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Estagiários</span>
                            <div className="metric-value-row">
                                <span className="metric-number">{dados.estagiariosCadastrados}</span>
                                <span className="metric-detail">Estagiários</span>
                            </div>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Professores</span>
                            <div className="metric-value-row">
                                <span className="metric-number">{dados.professoresCadastrados}</span>
                                <span className="metric-detail">Professores</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="error-state">Não foi possível carregar os dados.</div>
                )}
            </div>
        </div>
    );
};

export default RelatorioResumo;