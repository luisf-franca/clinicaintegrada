import axios from 'axios';

const BloquearDesbloquearSala = async (salaId) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/salas/${salaId}/bloquear-desbloquear`;

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
    console.error('Erro ao bloquear/desbloquear sala:', error);
    throw error;
  }
};

export default BloquearDesbloquearSala;
