import axios from 'axios';

const GetConsultaById = async (consultaId) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/consultas/${consultaId}`;

    const token = localStorage.getItem('token');

    const response = await axios.get(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar consulta:', error);
    throw error;
  }
};

export default GetConsultaById;
