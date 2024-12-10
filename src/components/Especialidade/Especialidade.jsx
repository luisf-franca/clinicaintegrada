import React from 'react';

const Especialidade = ({ selectedSpecialty, onSelectSpecialty }) => {
  return (
    <div className="especialidade">
      <select
        value={selectedSpecialty}
        onChange={(e) => onSelectSpecialty(Number(e.target.value))}
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
