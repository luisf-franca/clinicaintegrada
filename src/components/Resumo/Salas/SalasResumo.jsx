import React, { useState, useEffect } from 'react';
import './SalasResumo.css';
import { useNavigate } from 'react-router-dom';

// FUNCTIONS
import GetSalas from '../../../functions/Salas/GetSalas';
import BloquearDesbloquearSala from '../../../functions/Salas/BloquearDesbloquearSala';

const SalasResumo = ({ especialidade }) => {
  const [salas, setSalas] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const navigate = useNavigate();

  const fetchSalas = async () => {
    try {
      const filters = especialidade ? `especialidade=${especialidade}` : null;
      const response = await GetSalas({ filter: filters });
      setSalas(response);
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, [especialidade]);

  const handleSelecionarSala = (e) => {
    const salaId = e.target.value;
    setSalaSelecionada(salas.find((sala) => sala.id === salaId));
  };

  const handleBloquearDesbloquear = async () => {
    if (!salaSelecionada) return;

    try {
      await BloquearDesbloquearSala(salaSelecionada.id);

      setSalaSelecionada((prevSala) => ({
        ...prevSala,
        isDisponivel: !prevSala.isDisponivel,
      }));
    } catch (error) {
      console.error('Erro ao bloquear/desbloquear sala:', error);
    }
  };

  const handleNavigateSalas = () => {
    navigate('/sala');
  };

  return (
    <div className="salas-resumo">
      <div className="salas-resumo__header">
        <h4>Salas</h4>
        <button onClick={handleNavigateSalas}>Novo Registro</button>
      </div>

      <div className="salas-resumo__body">
        {salas.length === 0 ? (
          <p>Nenhuma sala cadastrada para essa especialidade.</p>
        ) : (
          <>
            <div className="salas-resumo__select">
              <label htmlFor="salas-select">Escolha uma sala:</label>
              <select
                id="salas-select"
                onChange={handleSelecionarSala}
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma sala
                </option>
                {salas.map((sala) => (
                  <option key={sala.id} value={sala.id}>
                    {sala.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="salas-resumo__actions">
              <button
                onClick={handleBloquearDesbloquear}
                disabled={!salaSelecionada}
              >
                {salaSelecionada?.isDisponivel
                  ? 'Bloquear Sala'
                  : 'Desbloquear Sala'}
              </button>
            </div>

            {salaSelecionada && (
              <div className="salas-resumo__status">
                <p>
                  Sala selecionada: <strong>{salaSelecionada.nome}</strong>
                </p>
                <p>
                  Status:{' '}
                  <strong>
                    {salaSelecionada.isDisponivel
                      ? 'Desbloqueada'
                      : 'Bloqueada'}
                  </strong>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SalasResumo;
