import { api } from '../../contexts/AuthContext';

const CreateListaEsperaEntry = async (pacienteId, listaEsperaData) => {
  try {
    const response = await api.post(`/lista-espera/${pacienteId}`, listaEsperaData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar entrada na lista de espera:', error);
    throw error;
  }
};

export default CreateListaEsperaEntry;
