import { api } from '../../contexts/AuthContext';

const DeleteListaEsperaEntry = async (entryId) => {
  try {
    const response = await api.delete(`/lista-espera/${entryId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar entrada da lista de espera:', error);
    throw error;
  }
};

export default DeleteListaEsperaEntry;
