import { api } from '../../contexts/AuthContext';

const GetPacienteById = async (pacienteId) => {
  try {
    const response = await api.get(`/pacientes/${pacienteId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    throw error;
  }
};

export default GetPacienteById;
