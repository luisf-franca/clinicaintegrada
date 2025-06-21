import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideBar.css';

import HomeIcon from '../../icons/HomeIcon';
import ListaEsperaIcon from '../../icons/ListaEsperaIcon';
import PacienteIcon from '../../icons/PacienteIcon';
import AgendamentoIcon from '../../icons/AgendamentoIcon';
import ConsultaIcon from '../../icons/ConsultaIcon';
import RelatorioIcon from '../../icons/RelatorioIcon';
import EquipeIcon from '../../icons/EquipeIcon';
import SalaIcon from '../../icons/SalaIcon';

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
        <HomeIcon />
      </NavLink>
      <NavLink
        to="/agendamento"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Agendamento"
      >
        <AgendamentoIcon />
      </NavLink>
      <NavLink
        to="/listaespera"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Lista Espera"
      >
        <ListaEsperaIcon />
      </NavLink>
      <NavLink
        to="/pacientes"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Paciente"
      >
        <PacienteIcon />
      </NavLink>
      <NavLink
        to="/consulta"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Consulta"
      >
        <ConsultaIcon />
      </NavLink>
      <NavLink
        to="/relatorio"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Relatório"
      >
        <RelatorioIcon />
      </NavLink>
      <NavLink
        to="/equipe"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Equipe"
      >
        <EquipeIcon />
      </NavLink>
      <NavLink
        to="/sala"
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'selected' : ''}`
        }
        title="Sala"
      >
        <SalaIcon />
      </NavLink>
    </div>
  );
};

export default SideBar;
