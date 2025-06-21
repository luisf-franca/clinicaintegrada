import axios from 'axios';

const CreatePaciente = async (pacienteData) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/pacientes`;

    const token = localStorage.getItem('token');

    const response = await axios.post(fullUrl, pacienteData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    throw error;
  }
};

export default CreatePaciente;
