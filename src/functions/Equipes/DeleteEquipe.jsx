import { api } from '../../contexts/AuthContext';

const DeleteEquipe = async (equipeId) => {
  try {
    const response = await api.delete(`/equipes/${equipeId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar equipe:', error);
    throw error;
  }
};

export default DeleteEquipe;
