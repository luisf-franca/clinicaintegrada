import React, { useState, useEffect } from 'react';
import '../styles/consulta.css';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

// COMPONENTS
import Especialidade from '../components/Especialidade/Especialidade';
import PesquisarConsultas from '../components/Consultas/PesquisarConsultas';


// FUNCTIONS
import GetAgendamentoById from '../functions/Agendamentos/GetAgendamentoById';
import GetConsultaById from '../functions/Consultas/GetConsultaById';
import FormatarDateTimeToLocal from '../functions/FormatarDateTime/FormatDateTimeToLocal';

const Consulta = () => {
    const [selectedSpecialty, setSelectedSpecialty] = useState(localStorage.getItem('selectedSpecialty') || 1);
    const [registros, setRegistros] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState({});
    const [consultaSelecionada, setConsultaSelecionada] = useState({});

    useEffect(() => {
        const fetchAgendamento = async () => {
            try {
                const agendamento = await GetAgendamentoById(agendamentoSelecionado.id);
                console.log('Agendamento:', agendamento);
                setAgendamentoSelecionado(agendamento.data);
            } catch (error) {
                console.error('Erro ao buscar agendamento:', error);
            }
        };

        const fetchConsulta = async () => {
            try {
                const consulta = await GetConsultaById(consultaSelecionada.id);
                console.log('Consulta:', consulta);
                setConsultaSelecionada(consulta.data);
            } catch (error) {
                console.error('Erro ao buscar consulta:', error);
            }
        };

        if (agendamentoSelecionado.id) {
            fetchAgendamento();
        }

        if (consultaSelecionada.id) {
            fetchConsulta();
        }
    }, [agendamentoSelecionado.id, consultaSelecionada.id]);


    const handleTabChange = (index) => {
        setActiveTab(index);
    };

    // função para armazenar o ID do agendamento em agendamento.Id e o ID da consulta em consulta.Id
    const handleAgendamentoClick = (agendamentoId, consultaId) => {
        setAgendamentoSelecionado({
            id: agendamentoId
        });
        setConsultaSelecionada({
            id: consultaId
        });
    };

    return (
        <div className="consulta">
            <header className="consulta-header">
                <h1>Consulta</h1>
                <Especialidade
                    selectedSpecialty={selectedSpecialty}
                    onSelectSpecialty={setSelectedSpecialty}
                />
            </header>

            <main className="consulta-body">
                <Tabs selectedIndex={activeTab} onSelect={handleTabChange} className="consulta-tabs">
                    <TabList>
                        <Tab>Lista</Tab>
                        <Tab>Detalhes</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="consulta-tab-content">
                            <div className="search-container">
                                <h4>Paciente</h4>
                                <PesquisarConsultas setConsultas={setRegistros} especialidade={selectedSpecialty} />
                            </div>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Observação</th>
                                            <th>Data/Hora Início</th>
                                            <th>Data/Hora Fim</th>
                                            <th>Especialidade</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registros.map((registro) => (
                                            <tr key={registro.id} onClick={() => handleAgendamentoClick(registro.agendamentoId, registro.id)}>
                                                <td>{registro.nome}</td>
                                                <td>{registro.observacao}</td>
                                                <td>{FormatarDateTimeToLocal(registro.dataHoraInicio)}</td>
                                                <td>{FormatarDateTimeToLocal(registro.dataHoraFim)}</td>
                                                <td>{registro.especialidade}</td>
                                                <td>{registro.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="consulta-detalhes">
                            {Object.keys(agendamentoSelecionado).length === 0 && Object.keys(consultaSelecionada).length === 0 ? (
                                <p>Selecione uma consulta na página anterior</p>
                            ) : (
                                <>
                                    <div className="top-section"></div>
                                    <div className="name-section">
                                        <div className="centered-content">{agendamentoSelecionado.nome}</div>
                                    </div>
                                    <div className="bottom-section">
                                        <div className="left-column">
                                            <h3>Agendamento</h3>
                                            <div>
                                                <p><strong>Data/Hora Início:</strong> {FormatarDateTimeToLocal(agendamentoSelecionado.dataHoraInicio)}</p>
                                                <p><strong>Data/Hora Fim:</strong> {FormatarDateTimeToLocal(agendamentoSelecionado.dataHoraFim)}</p>
                                                <p><strong>Tipo:</strong> {agendamentoSelecionado.tipo}</p>
                                                <p><strong>Status:</strong> {agendamentoSelecionado.status}</p>
                                                <p><strong>Sala:</strong> {agendamentoSelecionado.sala}</p>
                                            </div>
                                        </div>
                                        <div className="right-column">
                                            <h3>Consulta</h3>
                                            <div>
                                                <p><strong>Observação:</strong> {consultaSelecionada.observacao}</p>
                                                <p><strong>Data/Hora Início:</strong> {FormatarDateTimeToLocal(consultaSelecionada.dataHoraInicio)}</p>
                                                <p><strong>Data/Hora Fim:</strong> {FormatarDateTimeToLocal(consultaSelecionada.dataHoraFim)}</p>
                                                <p><strong>Especialidade:</strong> {consultaSelecionada.especialidade}</p>
                                                <p><strong>Status:</strong> {consultaSelecionada.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </TabPanel>
                </Tabs>
            </main>
        </div>
    );
};

export default Consulta;