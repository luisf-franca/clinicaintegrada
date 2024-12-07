import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/home.css';

// PAGES
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
      <Route path="/" element={<Home />} />
      <Route path="/agendamento" element={<Agendamento />} />
      <Route path="/listaespera" element={<ListaEspera />} />
      <Route path="/pacientes" element={<Pacientes />} />
      <Route path="/relatorio" element={<Relatorio />} />
      <Route path="/consulta" element={<Consulta />} />
      <Route path="/equipe" element={<Equipe />} />
      <Route path="/sala" element={<Sala />} />

    </Routes>
  );
};

export default Router;
