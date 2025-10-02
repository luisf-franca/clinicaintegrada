import { api } from '../../contexts/AuthContext';

const IniciarConsulta = async (consultaId) => {
  try {
    const response = await api.put(`/consultas/${consultaId}/iniciar`, {});
    return response.data;
  } catch (error) {
    console.error('Erro ao iniciar consulta:', error);
    throw error;
  }
};

export default IniciarConsulta;
