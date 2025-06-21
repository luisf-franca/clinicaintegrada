import React, { useState, useEffect } from 'react';
import './AgendamentosResumo.css';
import { useNavigate } from 'react-router-dom';

// FUNCTIONS
import GetAgendamentos from '../../../functions/Agendamentos/GetAgendamentos';
import FormatarDateTimeToLocal from '../../../functions/FormatarDateTime/FormatDateTimeToLocal';

const AgendamentosResumo = ({ pacienteId, especialidade }) => {
  const [intervalo, setIntervalo] = useState('sempre');
  const [agendamentos, setAgendamentos] = useState([]);
  const [pacienteFilter, setPacienteFilter] = useState(pacienteId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const filters = [];
        if (especialidade) filters.push(`especialidade=${especialidade}`);
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
        setAgendamentos(response);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
    };

    fetchAgendamentos();
  }, [intervalo, especialidade, pacienteFilter]);

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
      <div className="agendamentos-resumo__header">
        <h4>Agendamentos</h4>
        <button onClick={handleNavigateAgendamentos}>Novo Registro</button>
      </div>

      <div className="agendamentos-resumo__intervalo">
        {['sempre', 'hoje', 'semana', 'mes'].map((opcao) => (
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
              <th>Data/Hora Início</th>
              <th>Data/Hora Fim</th>
              <th>Sala</th>
              <th>Status Consulta</th>
              <th>Especialidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.length > 0 ? (
              agendamentos.slice(0, 4).map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{FormatarDateTimeToLocal(item.dataHoraInicio)}</td>
                  <td>{FormatarDateTimeToLocal(item.dataHoraFim)}</td>
                  <td>{item.sala}</td>
                  <td>{item.statusConsulta}</td>
                  <td>{item.especialidade}</td>
                  <td>
                    <button onClick={() => handleNavigateConsulta(item.id)}>
                      Visualizar Consulta
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="agendamentos-resumo__empty">
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

export default AgendamentosResumo;
