import { useState, useEffect } from 'react';

// COMPONENTS
import UpdateListaEsperaEntry from '../../functions/ListaEspera/UpdateListaEsperaEntry';

const AtualizarRegistro = ({
  registroId,
  registroInicial,
  atualizarRegistros,
}) => {
  const [listaEspera, setListaEspera] = useState(registroInicial || {});
  const [paciente, setPaciente] = useState({
    nome: registroInicial?.nome,
  });

  useEffect(() => {
    if (registroInicial) {
      const formatDate = (date) => {
        if (!date) return '';
        return date.split('T')[0];
      };

      setPaciente({
        nome: registroInicial.nome,
      });

      setListaEspera({
        dataEntrada: formatDate(registroInicial.dataEntrada),
        dataSaida: formatDate(registroInicial.dataSaida),
        pacienteId: registroInicial.pacienteId,
        prioridade: registroInicial.prioridadeInt,
        especialidade: registroInicial.especialidadeInt,
        status: registroInicial.statusInt,
      });
    }
  }, [registroInicial, registroId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListaEspera((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // se a data de saida for string vazia, setar para null
      if (listaEspera.dataSaida === '') {
        listaEspera.dataSaida = null;
      }
      // se a data de entrada for string vazia, setar para null
      if (listaEspera.dataEntrada === '') {
        listaEspera.dataEntrada = null;
      }
      listaEspera.prioridade = parseInt(listaEspera.prioridade);
      listaEspera.status = parseInt(listaEspera.status);
      listaEspera.especialidade = parseInt(listaEspera.especialidade);
      console.log(listaEspera);
      await UpdateListaEsperaEntry(registroId, listaEspera);
      atualizarRegistros();
    } catch (error) {
      atualizarRegistros();
      console.error('Erro ao atualizar registro:', error);
    }
  };

  // Se não há registro selecionado, exibe a mensagem
  if (!registroInicial || !registroId) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <p style={{ color: 'var(--cinza)', marginTop: '1rem' }}>
          Pesquise e selecione um registro na lista ao lado para editar as informações.
        </p>
      </div>
    );
  }

  return (
    <>
      <label>
        Paciente
        <input
          type="text"
          value={paciente.nome || 'Nome não disponível'}
          readOnly
          style={{
            backgroundColor: 'var(--cinza-200)',
            color: 'var(--cinza-600)',
            border: 'none',
            padding: '5px',
          }}
        />
      </label>
      <label>
        Data de Entrada
        <input
          type="date"
          name="dataEntrada"
          value={listaEspera.dataEntrada}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Data de Saída
        <input
          type="date"
          name="dataSaida"
          value={listaEspera.dataSaida}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Status
        <select
          name="status"
          value={listaEspera.status}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione o status</option>
          <option value={1}>Aguardando</option>
          <option value={2}>Atendido</option>
          <option value={3}>Cancelado</option>
        </select>
      </label>
      <label>
        Prioridade
        <select
          name="prioridade"
          value={listaEspera.prioridade}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione a prioridade</option>
          <option value={1}>Baixa</option>
          <option value={2}>Média</option>
          <option value={3}>Alta</option>
        </select>
      </label>
      <button onClick={handleSubmit}>Atualizar Registro</button>
    </>
  );
};

export default AtualizarRegistro;
