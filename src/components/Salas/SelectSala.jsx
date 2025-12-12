import React, { useState, useEffect } from 'react';

// FUNCTIONS
import GetSalas from '../../functions/Salas/GetSalas';

// Este componente agora é totalmente controlado pelo pai.
const SelectSala = ({ especialidade, onSelectSala, onSelectSalaObj, selectedSala }) => {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalas = async () => {
      if (!especialidade) return;
      setLoading(true);
      try {
        const data = await GetSalas({
          filter: `Especialidade=${especialidade}`,
        });
        //console.log('Data from GetSalas in SelectSala:', data);
        setSalas(data.items || []);
        // Se nenhuma sala estiver selecionada no pai E houver salas na resposta,
        // sugere a primeira sala para o pai.
        if (!selectedSala && data.items && data.items.length > 0) {
          onSelectSala(data.items[0].id);
          if (onSelectSalaObj) onSelectSalaObj(data.items[0]);
        }
      } catch (error) {
        console.error('Erro ao buscar salas:', error);
        setSalas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalas();
    // A dependência 'onSelectSala' foi removida para evitar re-renderizações desnecessárias.
    // O 'selectedSala' foi adicionado para reavaliar a seleção se o pai mudar o valor.
  }, [especialidade, selectedSala]);

  const handleSalaChange = (e) => {
    const salaId = e.target.value;
    // Apenas notifica o pai sobre a mudança. Não controla mais o estado aqui.
    onSelectSala(salaId);

    if (onSelectSalaObj) {
      const salaObj = salas.find(s => s.id === salaId);
      if (salaObj) {
        onSelectSalaObj(salaObj);
      }
    }
  };

  return (
    // A div externa foi removida para dar mais flexibilidade de estilização ao componente pai.
    <select value={selectedSala || ''} onChange={handleSalaChange} disabled={loading}>
      {loading ? (
        <option value="">Carregando salas...</option>
      ) : salas.length === 0 ? (
        <option value="">Nenhuma sala disponível</option>
      ) : (
        <>
          {salas.map((sala) => (
            <option key={sala.id} value={sala.id}>
              {sala.nome}
            </option>
          ))}
        </>
      )}
    </select>
  );
};

export default SelectSala;