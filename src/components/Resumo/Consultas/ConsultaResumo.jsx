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
      <div className="consulta-resumo__header">
        <h2>Consultas</h2>
        <button
          onClick={handleCadastrarConsulta}
          className="btn-cadastrar-consulta"
        >
          Novo Registro
        </button>
      </div>

      <div className="consulta-resumo__body">
        <table className="consulta-resumo__table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Data/Hora</th>
              <th>Sala</th>
              <th>Equipe</th>
              <th>Especialidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {consultas.length > 0 ? (
              consultas.slice(0, 7).map((item) => (
                <tr key={item.id}>
                  <td>{item.paciente?.nome || 'N/A'}</td>
                  <td>
                    {item.agendamento?.dataHoraInicio
                      ? FormatarDateTimeToLocal(item.agendamento.dataHoraInicio)
                      : 'N/A'}
                  </td>
                  <td>{item.sala?.nome || 'N/A'}</td>
                  <td>{item.equipe?.nome || 'N/A'}</td>
                  <td>{item.especialidade}</td>
                  <td>{renderButton({ id: item.id })}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="consulta-resumo__empty">
                  {getEmptyMessage()}
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
