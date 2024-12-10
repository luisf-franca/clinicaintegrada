import React, { useEffect } from 'react';

const Especialidade = ({ selectedSpecialty, onSelectSpecialty }) => {

  // armazenar a especialidade selecionada no local storage para que a seleção persista entre as sessões

  const handleSpecialtyChange = (e) => {
    onSelectSpecialty(Number(e.target.value));
    localStorage.setItem('selectedSpecialty', e.target.value);
  }

  return (
    <div className="especialidade">
      <select
        value={selectedSpecialty}
        onChange={handleSpecialtyChange} // Agora apenas chama a função corretamente
      >
        <option value={1}>Psicologia</option>
        <option value={2}>Odontologia</option>
        <option value={3}>Fisioterapia</option>
        <option value={4}>Nutrição</option>
      </select>
    </div>
  );
};

export default Especialidade;
