import axios from 'axios';

const CreateListaEsperaEntry = async (pacienteId, listaEsperaData) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/lista-espera/${pacienteId}`;

    const token = localStorage.getItem('token');

    const response = await axios.post(fullUrl, listaEsperaData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao criar entrada na lista de espera:', error);
    throw error;
  }
};

export default CreateListaEsperaEntry;
