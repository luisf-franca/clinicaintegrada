import { api } from '../../contexts/AuthContext';

const PutConsultaById = async (consultaId, consultaData) => {
  try {
    const response = await api.put(`/consultas/${consultaId}`, consultaData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar consulta:', error);
    throw error;
  }
};

export default PutConsultaById;
