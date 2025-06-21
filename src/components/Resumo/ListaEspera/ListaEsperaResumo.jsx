import React, { useState, useEffect } from 'react';
import './ListaEsperaResumo.css';
import { useNavigate } from 'react-router-dom';

// FUNCTIONS
import GetListaEspera from '../../../functions/ListaEspera/GetListaEntries';
import FormatarDateTimeToLocal from '../../../functions/FormatarDateTime/FormatDateTimeToLocal';

const ListaEsperaResumo = ({ pacienteId, especialidade }) => {
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
        if (especialidade && especialidade !== '') {
          filters.push(`especialidade=${especialidade}`);
        }
        if (pacienteFilter && pacienteFilter !== '') {
          filters.push(`pacienteId=${pacienteFilter}`);
        }
        filters.push('status=1');
        const filterString = filters.length > 0 ? filters.join(',') : null;

        const response = await GetListaEspera({
          filter: filterString,
          orderBy: 'dataEntrada',
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
  }, [especialidade, pacienteFilter]);

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
      navigate(`/listaespera?pacienteId=${pacienteId}`);
    } else {
      navigate('/listaespera');
    }
  };

  const handleAgendarConsulta = (registroId) => {
    navigate(`/agendamento?agendamentoId=${registroId}`);
  };

  return (
    <div className="lista-espera-resumo">
      <div className="lista-espera-resumo__header">
        <h4>Lista de Espera</h4>
        <button onClick={handleCadastrarRegistroListaEspera}>
          Novo Registro
        </button>
      </div>

      <div className="lista-espera-resumo__body">
        <table className="lista-espera-resumo__table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data Entrada</th>
              <th>Prioridade</th>
              <th>Especialidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="lista-espera-resumo__loading">
                  Carregando...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="lista-espera-resumo__error">
                  {error}
                </td>
              </tr>
            ) : listaEspera.length > 0 ? (
              listaEspera.slice(0, 4).map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{FormatarDateTimeToLocal(item.dataEntrada)}</td>
                  <td>{item.prioridade}</td>
                  <td>{item.especialidade}</td>
                  <td>
                    <button onClick={() => handleAgendarConsulta(item.id)}>
                      Agendar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="lista-espera-resumo__empty">
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

export default ListaEsperaResumo;
