import { api } from '../../contexts/AuthContext';

const FinalizarTriagem = async (consultaId) => {
  try {
    const response = await api.put(`/consultas/${consultaId}/triagem/finalizar`, {});
    return response.data;
  } catch (error) {
    console.error('Erro ao iniciar triagem:', error);
    throw error;
  }
};

export default FinalizarTriagem;
