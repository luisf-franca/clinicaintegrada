import axios from 'axios';

const UpdatePaciente = async (pacienteId, pacienteData) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/pacientes/${pacienteId}`;

    const token = localStorage.getItem('token');

    const response = await axios.put(fullUrl, pacienteData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    throw error;
  }
};

export default UpdatePaciente;
