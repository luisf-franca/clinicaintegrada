import { api } from '../../contexts/AuthContext';

const GetPacienteEtapa = async (pacienteId) => {
  try {
    const response = await api.get(`/pacientes/${pacienteId}/localizar-etapa`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar etapa do paciente:', error);
    throw error;
  }
};

export default GetPacienteEtapa;
