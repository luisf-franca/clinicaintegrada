import axios from 'axios';

const UpdateListaEsperaEntry = async (entryId, entryData) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/lista-espera/${entryId}`;

    const token = localStorage.getItem('token');

    const response = await axios.put(fullUrl, entryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar entrada na lista de espera:', error);
    throw error;
  }
};

export default UpdateListaEsperaEntry;
