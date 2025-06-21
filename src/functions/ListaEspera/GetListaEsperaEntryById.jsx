import axios from 'axios';

const GetListaEsperaEntryById = async (entryId) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/lista-espera/${entryId}`;

    const token = localStorage.getItem('token');

    const response = await axios.get(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar entrada da lista de espera:', error);
    throw error;
  }
};

export default GetListaEsperaEntryById;
