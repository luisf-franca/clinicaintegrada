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

const Consulta = () => {
    const [selectedSpecialty, setSelectedSpecialty] = useState(1);
    const [registros, setRegistros] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState({
        id: "0123ea41-2b3c-4f55-a115-4e1573696c95",
        nome: null,
        dataHoraInicio: "2024-12-09T09:00:00",
        dataHoraFim: "2024-12-09T10:00:00",
        tipo: "Triagem",
        status: "Reservado",
        statusConsulta: "0",
        pacienteId: "d6bb34d4-2e61-49ac-b8fa-0ac4396ce389",
        sala: null,
        salaId: "29f5a94f-a05f-4e1c-8f5d-65fdf64b4488",
        consultaId: "73d9919a-5076-449e-afd3-9a3e3dfdc5ba"
    });
    const [consultaSelecionada, setConsultaSelecionada] = useState({
        id: "01a36e53-2285-4767-a500-0e4ddc9c2984",
        nome: null,
        observacao: "string",
        dataHoraInicio: null,
        dataHoraFim: null,
        especialidade: "Psicologia",
        status: "Agendada",
        agendamentoId: "50e7ca30-98f9-46ab-b114-4ee5ca385a43",
        equipeId: "f579920f-2b30-46d8-8d99-72ff20b650f6"
    });


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
                                            {/* <th>Agendamento ID</th>
                                        <th>Equipe ID</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registros.map((registro) => (
                                            <tr key={registro.id} onClick={() => handleAgendamentoClick(registro.agendamentoId, registro.id)}>
                                                <td>{registro.nome}</td>
                                                <td>{registro.observacao}</td>
                                                <td>{registro.dataHoraInicio}</td>
                                                <td>{registro.dataHoraFim}</td>
                                                <td>{registro.especialidade}</td>
                                                <td>{registro.status}</td>
                                                {/* <td>{registro.agendamentoId}</td> */}
                                                {/* <td>{registro.equipeId}</td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="consulta-detalhes">
                            <div className="top-section"></div>
                            <div className="name-section">
                                <div className="centered-content">Caio Arthur</div>
                            </div>
                            <div className="bottom-section">
                                <div className="left-column">
                                    <h4>Agendamento</h4>
                                    <div>
                                        <p><strong>ID:</strong> {agendamentoSelecionado.id}</p>
                                        <p><strong>Nome:</strong> {agendamentoSelecionado.nome}</p>
                                        <p><strong>Data/Hora Início:</strong> {agendamentoSelecionado.dataHoraInicio}</p>
                                        <p><strong>Data/Hora Fim:</strong> {agendamentoSelecionado.dataHoraFim}</p>
                                        <p><strong>Tipo:</strong> {agendamentoSelecionado.tipo}</p>
                                        <p><strong>Status:</strong> {agendamentoSelecionado.status}</p>
                                        <p><strong>Status Consulta:</strong> {agendamentoSelecionado.statusConsulta}</p>
                                        <p><strong>Paciente ID:</strong> {agendamentoSelecionado.pacienteId}</p>
                                        <p><strong>Sala:</strong> {agendamentoSelecionado.sala}</p>
                                        <p><strong>Sala ID:</strong> {agendamentoSelecionado.salaId}</p>
                                        <p><strong>Consulta ID:</strong> {agendamentoSelecionado.consultaId}</p>                                </div>
                                </div>
                                <div className="right-column">
                                    <h4>Consulta</h4>
                                    <div>
                                        <p><strong>ID:</strong> {consultaSelecionada.id}</p>
                                        <p><strong>Nome:</strong> {consultaSelecionada.nome}</p>
                                        <p><strong>Observação:</strong> {consultaSelecionada.observacao}</p>
                                        <p><strong>Data/Hora Início:</strong> {consultaSelecionada.dataHoraInicio}</p>
                                        <p><strong>Data/Hora Fim:</strong> {consultaSelecionada.dataHoraFim}</p>
                                        <p><strong>Especialidade:</strong> {consultaSelecionada.especialidade}</p>
                                        <p><strong>Status:</strong> {consultaSelecionada.status}</p>
                                        <p><strong>Agendamento ID:</strong> {consultaSelecionada.agendamentoId}</p>
                                        <p><strong>Equipe ID:</strong> {consultaSelecionada.equipeId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
            </main>
        </div>
    );
};

export default Consulta;