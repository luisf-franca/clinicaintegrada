import { api } from '../../contexts/AuthContext';

const DeleteSala = async (salaId) => {
  try {
    const response = await api.delete(`/salas/${salaId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar sala:', error);
    throw error;
  }
};

export default DeleteSala;
