import { api } from '../../contexts/AuthContext';

const CreateAgendamento = async (agendamentoData) => {
  try {
    const response = await api.post('/agendamentos/consulta-triagem', agendamentoData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    throw error;
  }
};

export default CreateAgendamento;
