import React, { useState, useEffect, useMemo } from 'react';
import './SalasResumo.css';
import { useNavigate } from 'react-router-dom';

// FUNCTIONS
import GetSalas from '../../../functions/Salas/GetSalas';
import BloquearDesbloquearSala from '../../../functions/Salas/BloquearDesbloquearSala';
import GetSalasAtivas from '../../../functions/Salas/GetSalasAtivas';

const SalasResumo = ({ especialidade }) => {
  const [salas, setSalas] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [mapaConsultas, setMapaConsultas] = useState({});
  const navigate = useNavigate();

  const fetchSalas = async () => {
    try {
      const filters = especialidade ? `especialidade=${especialidade}` : null;

      const [salasResponse, ativasResponse] = await Promise.all([
        GetSalas({ filter: filters }),
        GetSalasAtivas()
      ]);

      const data = salasResponse?.items || salasResponse || [];
      setSalas(Array.isArray(data) ? data : []);

      console.log("ativasResponse", ativasResponse);

      const map = {};
      if (Array.isArray(ativasResponse)) {
        ativasResponse.forEach(item => {
          if (item.salaId) map[item.salaId] = item.consultaId;
        });
      }
      setMapaConsultas(map);


    } catch (error) {
      console.error('Erro ao buscar salas:', error);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, [especialidade]);

  // Filtra automaticamente as salas bloqueadas baseada no estado atual
  const salasBloqueadas = useMemo(() => {
    console.log("Salas bloqueadas:", salas.filter(s => !s.isDisponivel));
    return salas.filter(s => !s.isDisponivel);
  }, [salas]);

  const handleSelectChange = (e) => {
    const salaId = e.target.value;
    const sala = salas.find((s) => s.id === salaId);
    setSalaSelecionada(sala);
  };

  // Função única para alternar o status (funciona tanto pelo Select quanto pela Lista)
  const toggleSalaStatus = async (salaAlvo) => {
    if (!salaAlvo) return;

    try {
      await BloquearDesbloquearSala(salaAlvo.id);

      // Atualiza a lista principal para refletir a mudança em ambos os lugares (Select e Lista)
      setSalas((prevSalas) =>
        prevSalas.map((s) =>
          s.id === salaAlvo.id ? { ...s, isDisponivel: !s.isDisponivel } : s
        )
      );

      // Se a sala alterada for a que está selecionada no dropdown, atualiza ela também
      if (salaSelecionada && salaSelecionada.id === salaAlvo.id) {
        setSalaSelecionada((prev) => ({ ...prev, isDisponivel: !prev.isDisponivel }));
      }

    } catch (error) {
      console.error('Erro ao bloquear/desbloquear sala:', error);
    }
  };

  return (
    <div className="salas-resumo compact-widget">
      <div className="salas-resumo__header widget-header" onClick={() => navigate('/sala')}>
        <h4>Salas ↗</h4>
      </div>

      <div className="salas-resumo__body compact-body">
        {/* --- ÁREA DE SELEÇÃO E AÇÃO MANUAL --- */}
        <div className="selection-area">
          <div className="salas-compact-row">
            <select
              onChange={handleSelectChange}
              value={salaSelecionada?.id || ""}
              className="salas-select-compact"
            >
              <option value="" disabled>Selecione uma sala...</option>
              {salas.map((sala) => (
                <option key={sala.id} value={sala.id}>
                  {sala.nome}
                </option>
              ))}
            </select>

            <button
              onClick={() => toggleSalaStatus(salaSelecionada)}
              disabled={!salaSelecionada}
              className={`btn-icon-lock ${salaSelecionada?.isDisponivel ? 'unlocked' : 'locked'}`}
              title={salaSelecionada ? (salaSelecionada.isDisponivel ? 'Bloquear' : 'Desbloquear') : ''}
            >
              {salaSelecionada ? (salaSelecionada.isDisponivel ? '🔓' : '🔒') : '🔒'}
            </button>
          </div>

          {salaSelecionada && (
            <div className="sala-status-mini">
              <span className={`status-dot ${salaSelecionada.isDisponivel ? 'green' : 'red'}`}></span>
              <small>
                {salaSelecionada.isDisponivel ? 'Disponível' : 'Bloqueada'}
              </small>
            </div>
          )}
        </div>

        <div className="divider"></div>

        {/* --- LISTA DE SALAS BLOQUEADAS --- */}
        <div className="blocked-list-section">
          <h5 className="section-title">Em uso ({salasBloqueadas.length})</h5>

          {salasBloqueadas.length === 0 ? (
            <p className="empty-msg">Nenhuma sala em uso.</p>
          ) : (
            <ul className="blocked-list">
              {salasBloqueadas.map((sala) => {
                const consultaId = mapaConsultas[sala.id];
                return (
                  <li key={sala.id} className="blocked-item">
                    <span
                      className="room-name"
                      onClick={() => consultaId && navigate(`/consulta?consultaId=${consultaId}&tab=1`)}
                      style={consultaId ? { cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' } : {}}
                      title={consultaId ? "Ir para consulta" : ""}
                    >
                      {sala.nome}{consultaId && " ↗"}
                    </span>
                    <button
                      className="btn-quick-unlock"
                      onClick={() => toggleSalaStatus(sala)}
                      title="Liberar Sala"
                    >
                      Liberar 🔓
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalasResumo;