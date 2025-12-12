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
      const data = response?.items || response || [];
      setSalas(Array.isArray(data) ? data : []);
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
    <div className="salas-resumo compact-widget">
      <div className="salas-resumo__header widget-header" onClick={() => navigate('/sala')}>
        <h4>Salas ↗</h4>
      </div>

      <div className="salas-resumo__body compact-body">
        {salas.length === 0 ? (
          <p className="salas-message">Nenhuma sala encontrada.</p>
        ) : (
          <div className="salas-compact-row">
            <select
              id="salas-select"
              onChange={handleSelecionarSala}
              defaultValue=""
              className="salas-select-compact"
            >
              <option value="" disabled>
                Selecione uma sala...
              </option>
              {salas.map((sala) => (
                <option key={sala.id} value={sala.id}>
                  {sala.nome}
                </option>
              ))}
            </select>

            <button
              onClick={handleBloquearDesbloquear}
              disabled={!salaSelecionada}
              className={`btn-icon-lock ${salaSelecionada?.isDisponivel ? 'unlocked' : 'locked'}`}
              title={salaSelecionada ? (salaSelecionada.isDisponivel ? 'Bloquear' : 'Desbloquear') : 'Selecione uma sala'}
            >
              {salaSelecionada ? (salaSelecionada.isDisponivel ? '🔓' : '🔒') : '🔒'}
            </button>
          </div>
        )}

        {salaSelecionada && (
          <div className="sala-status-mini">
            <small>
              {salaSelecionada.isDisponivel ? 'Disponível' : 'Bloqueada'}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalasResumo;
