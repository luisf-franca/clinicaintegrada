import { api } from '../../contexts/AuthContext';

const IniciarTriagem = async (consultaId) => {
  try {
    const response = await api.put(`/consultas/${consultaId}/triagem/iniciar`, {});
    return response.data;
  } catch (error) {
    console.error('Erro ao iniciar triagem:', error);
    throw error;
  }
};

export default IniciarTriagem;
