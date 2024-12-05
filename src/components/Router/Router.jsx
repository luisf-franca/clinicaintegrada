import React from 'react';
import { Routes, Route } from 'react-router-dom';

// PAGES
import Home from '../../pages/home/home';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default Router;
