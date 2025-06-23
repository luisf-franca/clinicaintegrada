import React, { useState, useEffect } from 'react';

// FUNCTIONS
import GetSalas from '../../functions/Salas/GetSalas';

const SelectSala = ({ especialidade, onSelectSala }) => {
  const [salas, setSalas] = useState([]);
  const [selectedSalaId, setSelectedSalaId] = useState(null);

  const getEspecialidade = () => {
    switch (especialidade) {
      case 1:
        return 'psicologia';
      case 2:
        return 'odontologia';
      case 3:
        return 'fisioterapia';
      case 4:
        return 'nutrição';
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const data = await GetSalas({
          filter: `especialidade=${especialidade}`,
        });
        setSalas(data);
        
        // Seleciona a primeira sala automaticamente se houver salas disponíveis
        if (data.length > 0) {
          setSelectedSalaId(data[0].id);
          onSelectSala(data[0].id);
        } else {
          setSelectedSalaId(null);
          onSelectSala(null);
        }
      } catch (error) {
        console.error('Erro ao buscar salas:', error);
        setSalas([]);
        setSelectedSalaId(null);
        onSelectSala(null);
      }
    };

    fetchSalas();
  }, [especialidade, onSelectSala]);

  const handleSalaChange = (e) => {
    const salaId = e.target.value;
    setSelectedSalaId(salaId);
    onSelectSala(salaId);
  };

  return (
    <div className="especialidade">
      <select value={selectedSalaId || ''} onChange={handleSalaChange}>
        {salas.length === 0 ? (
          <option value="">
            Nenhuma sala disponível para {getEspecialidade()}
          </option>
        ) : (
          <option value="">Selecione uma sala</option>
        )}
        {salas.map((sala) => (
          <option key={sala.id} value={sala.id}>
            {sala.nome}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectSala;
