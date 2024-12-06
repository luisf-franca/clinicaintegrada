import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/home.css';

// PAGES
import Home from './pages/home';
import Agendamento from './pages/agendamento';
import ListaEspera from './pages/listaespera';
import Pacientes from './pages/pacientes';
import Relatorio from './pages/relatorio';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agendamento" element={<Agendamento />} />
      <Route path="/listaespera" element={<ListaEspera />} />
      <Route path="/pacientes" element={<Pacientes />} />
      <Route path="/relatorio" element={<Relatorio />} />
    </Routes>
  );
};

export default Router;
