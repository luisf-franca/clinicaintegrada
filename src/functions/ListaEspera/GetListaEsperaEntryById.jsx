import { api } from '../../contexts/AuthContext';

const GetListaEsperaEntryById = async (entryId) => {
  try {
    const response = await api.get(`/lista-espera/${entryId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar entrada da lista de espera:', error);
    throw error;
  }
};

export default GetListaEsperaEntryById;
