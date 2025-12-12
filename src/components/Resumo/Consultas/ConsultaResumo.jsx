import { useState, useEffect } from 'react';
import './ConsultaResumo.css';
import { useNavigate } from 'react-router-dom';

// FUNCTIONS
import GetConsultas from '../../../functions/Consultas/GetConsultas';
import FormatarDateTimeToLocal from '../../../functions/FormatarDateTime/FormatDateTimeToLocal';

const ConsultaResumo = ({ pacienteId }) => {
  const [consultas, setConsultas] = useState([]);
  const [pacienteFilter, setPacienteFilter] = useState(pacienteId);
  const [atualizarRegistros, setAtualizarRegistros] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const filters = [];
        if (pacienteFilter) filters.push(`pacienteId=${pacienteFilter}`);
        const filterString = filters.length > 0 ? filters.join(',') : null;

        const response = await GetConsultas({ filter: filterString });
        //console.log('response', response);
        setConsultas(response);
      } catch (error) {
        console.error('Erro ao buscar consultas:', error);
      }
    };

    fetchConsultas();
  }, [pacienteFilter, atualizarRegistros]);

  const getEmptyMessage = () => {
    if (pacienteId && consultas.length === 0) {
      return 'Nenhum registro encontrado para o paciente selecionado, considere cadastrar um novo registro.';
    }
    if (!pacienteId && consultas.length === 0) {
      return 'Nenhum registro encontrado, considere cadastrar um novo registro.';
    }
    return null;
  };

  const handleCadastrarConsulta = () => {
    navigate('/agendamento');
  };

  const handleNavigateConsulta = (consultaId) => {
    navigate(`/consulta?consultaId=${consultaId}&tab=1`);
  };

  const handleAtualizarRegistros = () => {
    setAtualizarRegistros(!atualizarRegistros);
  };

  const renderButton = ({ id }) => {
    return (
      <button onClick={() => handleAction('visualizar-consulta', id)}>
        Visualizar Consulta
      </button>
    );
  };

  const handleAction = async (action, consultaId) => {
    switch (action) {
      case 'visualizar-consulta':
        handleNavigateConsulta(consultaId);
        break;
      default:
        console.log(`Ação desconhecida: ${action}`);
    }
  };

  return (
    <div className="consulta-resumo">
      <div
        className="consulta-resumo__header widget-header"
        onClick={() => navigate('/consulta')}
        title="Ver todas as consultas"
      >
        <h4>Consultas ↗</h4>
      </div>

      <div className="consulta-resumo__body">
        <table className="consulta-resumo__table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Horário</th>
              <th>Médico/Equipe</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {consultas.length > 0 ? (
              consultas.map((item) => (
                <tr key={item.id} onClick={() => handleNavigateConsulta(item.id)} style={{ cursor: 'pointer' }}>
                  <td title={item.paciente?.nome}>
                    <div className="truncate-text">{item.paciente?.nome || 'N/A'}</div>
                  </td>
                  <td>
                    {item.agendamento?.dataHoraInicio
                      ? new Date(item.agendamento.dataHoraInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '-'}
                  </td>
                  <td title={item.equipe?.nome}>
                    <div className="truncate-text">{item.equipe?.nome || 'N/A'}</div>
                  </td>
                  <td>{item.status || 'Agendada'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="consulta-resumo__empty">
                  {getEmptyMessage() || 'Nenhuma consulta.'}
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

export default ConsultaResumo;
