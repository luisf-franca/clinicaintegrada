import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideBar.css';

import HomeIcon from '../../icons/HomeIcon';
import ListaEsperaIcon from '../../icons/ListaEsperaIcon';
import PacienteIcon from '../../icons/PacienteIcon';
import AgendamentoIcon from '../../icons/AgendamentoIcon';
import ConsultaIcon from '../../icons/ConsultaIcon';
import EquipeIcon from '../../icons/EquipeIcon';
import SalaIcon from '../../icons/SalaIcon';
import ProfissionalIcon from '../../icons/ProfissionalIcon';
import LogoutIcon from '../../icons/LogoutIcon';
import { useAuth } from '../../contexts/AuthContext';

const SideBar = () => {
  // Função para lidar com o logout
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <div className="sidebar">
      {/* Container para os itens de navegação principais */}
      <div className="sidebar-navigation">
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
        {/* ... (resto dos seus NavLinks) */}
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
          to="/sala"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? 'selected' : ''}`
          }
          title="Sala"
        >
          <SalaIcon />
        </NavLink>
        <NavLink
          to="/profissionais"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? 'selected' : ''}`
          }
          title="Profissionais"
        >
          <ProfissionalIcon />
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
      </div>

      <div
        className="sidebar-item sidebar-logout"
        title="Sair"
        onClick={handleLogout}
      >
        <LogoutIcon />
      </div>
    </div>
  );
};

export default SideBar;