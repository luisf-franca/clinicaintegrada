import { api } from '../../contexts/AuthContext';

const DeletePaciente = async (pacienteId) => {
  try {
    const response = await api.delete(`/pacientes/${pacienteId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    throw error;
  }
};

export default DeletePaciente;
