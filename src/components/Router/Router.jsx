import React from 'react';
import { Routes, Route } from 'react-router-dom';

// PAGES
import Agendamento from '../../pages/agendamento/agendamento';
import Relatorio from '../../pages/relatorio/relatorio';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Agendamento />} />
      <Route path="/relatorio" element={<Relatorio />} />
    </Routes>
  );
};

export default Router;
