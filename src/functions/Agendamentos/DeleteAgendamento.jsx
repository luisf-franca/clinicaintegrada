import axios from 'axios';

const DeleteAgendamento = async (agendamentoId) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/agendamentos/${agendamentoId}`;

    const token = localStorage.getItem('token');

    const response = await axios.delete(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    throw error;
  }
};

export default DeleteAgendamento;
