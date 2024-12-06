import React from 'react';

const Especialidade = ({ selectedSpecialty, onSelectSpecialty }) => {
  const specialties = [
    { id: 1, name: 'Psicologia' },
    { id: 2, name: 'Fisioterapia' },
    { id: 3, name: 'Odontologia' },
    { id: 4, name: 'Nutrição' },
  ];

  const handleSelectChange = (event) => {
    const selectedId = parseInt(event.target.value, 10);
    onSelectSpecialty(selectedId);
  };

  return (
    <div className="especialidade">
      <h4>Especialidade</h4>
      <select value={selectedSpecialty || ''} onChange={handleSelectChange}>
        <option value={0}>Todas</option>
        {specialties.map((specialty) => (
          <option key={specialty.id} value={specialty.id}>
            {specialty.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Especialidade;
