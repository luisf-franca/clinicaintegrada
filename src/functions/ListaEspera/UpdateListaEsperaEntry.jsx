import { api } from '../../contexts/AuthContext';

const UpdateListaEsperaEntry = async (entryId, entryData) => {
  try {
    const response = await api.put(`/lista-espera/${entryId}`, entryData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar entrada na lista de espera:', error);
    throw error;
  }
};

export default UpdateListaEsperaEntry;
