import axios from 'axios';

const DeletePaciente = async (pacienteId) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/pacientes/${pacienteId}`;

    const token = localStorage.getItem('token');

    const response = await axios.delete(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    throw error;
  }
};

export default DeletePaciente;
