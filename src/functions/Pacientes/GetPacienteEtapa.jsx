import axios from 'axios';

const GetPacienteEtapa = async (pacienteId) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/pacientes/${pacienteId}/localizar-etapa`;

    const token = localStorage.getItem('token');

    const response = await axios.get(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar etapa do paciente:', error);
    throw error;
  }
};

export default GetPacienteEtapa;
