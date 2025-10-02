import { api } from '../../contexts/AuthContext';

const GetAgendamentoById = async (agendamentoId) => {
  try {
    const response = await api.get(`/agendamentos/${agendamentoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    throw error;
  }
};

export default GetAgendamentoById;
