import React, { useState, useEffect } from 'react';
import './AgendamentosResumo.css';
import { useNavigate } from 'react-router-dom';

// FUNCTIONS
import GetAgendamentos from '../../../functions/Agendamentos/GetAgendamentos';
import FormatarDateTimeToLocal from '../../../functions/FormatarDateTime/FormatDateTimeToLocal';

const AgendamentosResumo = ({ pacienteId }) => {
  const [intervalo, setIntervalo] = useState('hoje');
  const [agendamentos, setAgendamentos] = useState([]);
  const [pacienteFilter, setPacienteFilter] = useState(pacienteId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const filters = [];
        if (pacienteFilter) filters.push(`pacienteId=${pacienteFilter}`);
        filters.push('status=1');

        if (intervalo !== 'sempre') {
          const now = new Date();
          const startOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          let startDate, endDate;

          if (intervalo === 'hoje') {
            startDate = startOfDay;
            endDate = new Date(startOfDay);
            endDate.setDate(startOfDay.getDate() + 1);
          } else if (intervalo === 'semana') {
            startDate = new Date(startOfDay);
            startDate.setDate(startOfDay.getDate() - startOfDay.getDay());
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 7);
          } else if (intervalo === 'mes') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          }

          filters.push(
            `dataHoraInicio>${startDate.toISOString().split('T')[0]}`,
            `dataHoraInicio<${endDate.toISOString().split('T')[0]}`,
          );
        }

        const filterString = filters.join(',');
        const response = await GetAgendamentos({ filter: filterString });
        //console.log('Agendamentos:', response);
        setAgendamentos(response);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
    };

    fetchAgendamentos();
  }, [intervalo, pacienteFilter]);

  const getEmptyMessage = () => {
    if (pacienteId && agendamentos.length === 0) {
      return 'Nenhum registro não concluído para o paciente selecionado, considere cadastrar um novo registro.';
    }
    if (!pacienteId && agendamentos.length === 0) {
      return 'Nenhum registro não concluído encontrado, considere cadastrar um novo registro.';
    }
    return null;
  };

  const handleNavigateAgendamentos = () => {
    navigate('/agendamento');
  };

  const handleNavigateConsulta = (registroId) => {
    navigate(`/consulta?consultaId=${registroId}`);
  };

  return (
    <div className="agendamentos-resumo">
      <div
        className="agendamentos-resumo__header widget-header"
        onClick={() => navigate('/agendamento')}
        title="Ver agendamentos completos"
      >
        <h4>Agendamentos ↗</h4>
      </div>

      <div className="agendamentos-resumo__intervalo">
        {['hoje', 'semana', 'mes', 'sempre'].map((opcao) => (
          <button
            key={opcao}
            onClick={() => setIntervalo(opcao)}
            className={intervalo === opcao ? 'active' : ''}
          >
            {opcao.charAt(0).toUpperCase() + opcao.slice(1)}
          </button>
        ))}
      </div>

      <div className="agendamentos-resumo__body">
        <table className="agendamentos-resumo__table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Horário</th>
              <th>Sala</th>
              <th>Especialidade</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.length > 0 ? (
              agendamentos.map((item) => {
                const displayName = item.nome || item.nomeEquipe || item.equipe?.nome || 'Sem Nome';
                return (
                  <tr key={item.id} onClick={() => handleNavigateConsulta(item.consultaId)} style={{ cursor: 'pointer' }}>
                    <td title={displayName}>
                      <div className="truncate-text">{displayName}</div>
                    </td>
                    <td>
                      {item.dataHoraInicio
                        ? new Date(item.dataHoraInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '-'}
                    </td>
                    <td>{item.sala}</td>
                    <td>{item.especialidade}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="agendamentos-resumo__empty">
                  {getEmptyMessage() || 'Sem agendamentos.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {pacienteFilter && (
          <div className="agendamentos-resumo__filtro">
            <span>Filtrando por paciente selecionado</span>
            <button onClick={() => setPacienteFilter(null)}>
              Mostrar Tudo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendamentosResumo;
