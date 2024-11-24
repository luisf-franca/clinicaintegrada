import React from 'react';
import './SideBar.css';

import iconInicio from '../../assets/icons/icon-listaEspera.png';
import iconPaciente from '../../assets/icons/icon-paciente.png';
import iconAgendamento from '../../assets/icons/icon-agendamento.png';
import iconConsulta from '../../assets/icons/icon-consulta.png';
import iconRelatorio from '../../assets/icons/icon-relatorio.png';
import iconEquipe from '../../assets/icons/icon-equipe.png';
import iconSala from '../../assets/icons/icon-sala.png';

const SideBar = () => {
    return (
        <div className="sidebar">
            <button className="sidebar-item" title="Início">
                <img src={iconInicio} alt="Início" />
            </button>
            <button className="sidebar-item" title="Paciente">
                <img src={iconPaciente} alt="Paciente" />
            </button>
            <button className="sidebar-item" title="Agendamento">
                <img src={iconAgendamento} alt="Agendamento" />
            </button>
            <button className="sidebar-item" title="Consulta">
                <img src={iconConsulta} alt="Consulta" />
            </button>
            <button className="sidebar-item" title="Relatório">
                <img src={iconRelatorio} alt="Relatório" />
            </button> 
             <button className="sidebar-item" title="Equipe">
                <img src={iconEquipe} alt="Equipe" />
            </button>
            <button className="sidebar-item" title="Sala">
                <img src={iconSala} alt="Sala" />
            </button>
        </div>
    );
};

export default SideBar;
