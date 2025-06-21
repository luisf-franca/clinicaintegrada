import axios from 'axios';

const IniciarTriagem = async (consultaId) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/consultas/${consultaId}/triagem/iniciar`;

    const token = localStorage.getItem('token');

    const response = await axios.put(
      fullUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Erro ao iniciar triagem:', error);
    throw error;
  }
};

export default IniciarTriagem;
