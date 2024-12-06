import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideBar.css';

import iconHome from '../../assets/icons/icon-home.jpg';
import iconListaEspera from '../../assets/icons/icon-listaEspera.png';
import iconPaciente from '../../assets/icons/icon-paciente.png';
import iconAgendamento from '../../assets/icons/icon-agendamento.png';
import iconConsulta from '../../assets/icons/icon-consulta.png';
import iconRelatorio from '../../assets/icons/icon-relatorio.png';
import iconEquipe from '../../assets/icons/icon-equipe.png';
import iconSala from '../../assets/icons/icon-sala.png';

const SideBar = () => {
  return (
    <div className="sidebar">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Home"
      >
        <img src={iconHome} alt="Inicio" />
      </NavLink>
      <NavLink
        to="/agendamento"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Agendamento"
      >
        <img src={iconAgendamento} alt="Agendamento" />
      </NavLink>
      <NavLink
        to="/listaespera"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Lista Espera"
      >
        <img src={iconListaEspera} alt="Lista Espera" />
      </NavLink>
      <NavLink
        to="/pacientes"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Paciente"
      >
        <img src={iconPaciente} alt="Paciente" />
      </NavLink>
      <NavLink
        to="/consulta"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Consulta"
      >
        <img src={iconConsulta} alt="Consulta" />
      </NavLink>
      <NavLink
        to="/relatorio"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Relatório"
      >
        <img src={iconRelatorio} alt="Relatório" />
      </NavLink>
      <NavLink
        to="/equipe"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Equipe"
      >
        <img src={iconEquipe} alt="Equipe" />
      </NavLink>
      <NavLink
        to="/sala"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Sala"
      >
        <img src={iconSala} alt="Sala" />
      </NavLink>
    </div>
  );
};

export default SideBar;
