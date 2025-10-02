import { api } from '../../contexts/AuthContext';

const CreatePaciente = async (pacienteData) => {
  try {
    const response = await api.post('/pacientes', pacienteData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    throw error;
  }
};

export default CreatePaciente;
