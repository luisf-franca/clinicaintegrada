import { api } from '../../contexts/AuthContext';

const UpdateSala = async (salaId, salaData) => {
  try {
    const response = await api.put(`/salas/${salaId}`, salaData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar sala:', error);
    throw error;
  }
};

export default UpdateSala;
