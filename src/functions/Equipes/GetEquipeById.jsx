import { api } from '../../contexts/AuthContext';

const GetEquipeById = async (equipeId) => {
  try {
    const response = await api.get(`/equipes/${equipeId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar equipe:', error);
    throw error;
  }
};

export default GetEquipeById;
