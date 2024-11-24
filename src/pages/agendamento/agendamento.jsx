import React from 'react';
import './agendamento.css';

//COMPONENTS
import SideBar from '../../components/SideBar/SideBar';

const Agendamento = () => {
  return (
    <div className="main-layout">
      <section className="pages">
        <main className="container">
        <SideBar />
        </main>
      </section>
    </div>
  );
};

export default Agendamento;
