import React, { useState, useEffect } from 'react';
import './ListaEsperaResumo.css';
import { useNavigate } from 'react-router-dom';

// FUNCTIONS
import GetListaEspera from '../../../functions/ListaEspera/GetListaEntries';
import FormatarDateTimeToLocal from '../../../functions/FormatarDateTime/FormatDateTimeToLocal';

const ListaEsperaResumo = ({ pacienteId }) => {
  const [listaEspera, setListaEspera] = useState([]);
  const [pacienteFilter, setPacienteFilter] = useState(pacienteId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setPacienteFilter(pacienteId);
  }, [pacienteId]);

  useEffect(() => {
    const fetchListaEspera = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filters = [];
        if (pacienteFilter && pacienteFilter !== '') {
          filters.push(`pacienteId=${pacienteFilter}`);
        }
        filters.push('status=1');

        const filterString = filters.length > 0 ? filters.join(',') : null;

        const response = await GetListaEspera({
          filter: filterString,
          orderBy: 'dataEntrada',
          pageSize: 5,
        });
        setListaEspera(response?.items || response || []);
      } catch (error) {
        console.error('Erro ao buscar lista de espera:', error);
        setError('Erro ao carregar lista de espera');
        setListaEspera([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListaEspera();
  }, [pacienteFilter]);

  const getEmptyMessage = () => {
    if (pacienteId && listaEspera.length === 0) {
      return 'Nenhum registro não concluído para o paciente selecionado, considere cadastrar um novo registro.';
    }
    if (!pacienteId && listaEspera.length === 0) {
      return 'Nenhum registro não concluído encontrado, considere cadastrar um novo registro.';
    }
    return null;
  };

  const handleCadastrarRegistroListaEspera = () => {
    if (pacienteId && listaEspera.length === 0) {
      navigate(`/listaespera?pacienteId=${pacienteId}&view=add`);
    } else {
      navigate('/listaespera?view=add');
    }
  };

  const handleAgendarConsulta = (registroId) => {
    // Encontra o registro correspondente para obter a especialidade
    const registro = listaEspera.find(item => item.id === registroId);
    if (registro) {
      // Tenta usar especialidadeInt primeiro, depois especialidade como fallback
      const especialidadeId = registro.especialidadeInt || registro.especialidade;
      if (especialidadeId) {
        navigate(`/agendamento?agendamentoId=${registroId}&especialidade=${especialidadeId}`);
      } else {
        navigate(`/agendamento?agendamentoId=${registroId}`);
      }
    } else {
      navigate(`/agendamento?agendamentoId=${registroId}`);
    }
  };

  return (
    <div className="lista-espera-resumo">
      <div
        className="lista-espera-resumo__header widget-header"
        onClick={() => navigate('/listaespera')}
        title="Ver lista de espera completa"
      >
        <h4>Lista de Espera ↗</h4>
      </div>

      <div className="lista-espera-resumo__body">
        <table className="lista-espera-resumo__table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Entrada</th>
              <th>Especialidade</th>
              <th style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="lista-espera-resumo__loading">
                  Carregando...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="lista-espera-resumo__error">
                  {error}
                </td>
              </tr>
            ) : listaEspera.length > 0 ? (
              listaEspera.map((item) => (
                <tr key={item.id}>
                  <td title={item.nome}>
                    <div className="truncate-text">{item.nome}</div>
                  </td>
                  <td>
                    {item.dataEntrada
                      ? new Date(item.dataEntrada).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>{item.especialidade}</td>
                  <td>
                    <button
                      className="btn-icon-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAgendarConsulta(item.id);
                      }}
                      title="Chamar / Agendar"
                    >
                      ▶
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="lista-espera-resumo__empty">
                  {getEmptyMessage() || 'Lista vazia.'}
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

export default ListaEsperaResumo;
