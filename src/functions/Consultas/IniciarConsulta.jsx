import axios from 'axios';

const IniciarConsulta = async (consultaId) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/consultas/${consultaId}/iniciar`;

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
    console.error('Erro ao iniciar consulta:', error);
    throw error;
  }
};

export default IniciarConsulta;
