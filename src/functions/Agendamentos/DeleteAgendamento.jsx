import { api } from '../../contexts/AuthContext';

const DeleteAgendamento = async (agendamentoId) => {
  try {
    const response = await api.delete(`/agendamentos/${agendamentoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    throw error;
  }
};

export default DeleteAgendamento;
