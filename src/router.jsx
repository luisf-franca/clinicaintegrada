import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/home.css';

// PAGES
import NotFound from './pages/NotFound';
import LoginPage from './pages/login';
import Profissionais from './pages/profissionais';
import Home from './pages/home';
import Agendamento from './pages/agendamento';
import ListaEspera from './pages/listaespera';
import Pacientes from './pages/pacientes';
import Relatorio from './pages/relatorio';
import Consulta from './pages/consulta';
import Equipe from './pages/equipe';
import Sala from './pages/sala';

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Home />} />
      <Route path="/agendamento" element={<Agendamento />} />
      <Route path="/listaespera" element={<ListaEspera />} />
      <Route path="/pacientes" element={<Pacientes />} />
      <Route path="/relatorio" element={<Relatorio />} />
      <Route path="/consulta" element={<Consulta />} />
      <Route path="/profissionais" element={<Profissionais />} />
      <Route path="/equipe" element={<Equipe />} />
      <Route path="/sala" element={<Sala />} />
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default Router;
