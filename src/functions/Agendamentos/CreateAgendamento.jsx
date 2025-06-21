import axios from 'axios';

const CreateAgendamento = async (agendamentoData) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/agendamentos/consulta-triagem`;

    const token = localStorage.getItem('token');

    const response = await axios.post(fullUrl, agendamentoData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    throw error;
  }
};

export default CreateAgendamento;
