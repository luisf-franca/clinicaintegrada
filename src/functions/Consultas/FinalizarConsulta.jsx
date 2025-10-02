import { api } from '../../contexts/AuthContext';

const FinalizarConsulta = async (consultaId) => {
  try {
    const response = await api.put(`/consultas/${consultaId}/finalizar`, {});
    return response.data;
  } catch (error) {
    console.error('Erro ao iniciar consulta:', error);
    throw error;
  }
};

export default FinalizarConsulta;
