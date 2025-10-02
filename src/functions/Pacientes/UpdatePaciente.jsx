import { api } from '../../contexts/AuthContext';

const UpdatePaciente = async (pacienteId, pacienteData) => {
  try {
    const response = await api.put(`/pacientes/${pacienteId}`, pacienteData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    throw error;
  }
};

export default UpdatePaciente;
