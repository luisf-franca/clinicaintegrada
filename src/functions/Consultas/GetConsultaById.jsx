import { api } from '../../contexts/AuthContext';

const GetConsultaById = async (consultaId) => {
  try {
    const response = await api.get(`/consultas/${consultaId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar consulta:', error);
    throw error;
  }
};

export default GetConsultaById;
