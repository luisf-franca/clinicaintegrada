import { api } from '../../contexts/AuthContext';

const CreateEquipe = async (equipeData) => {
  try {
    const response = await api.post('/equipes', equipeData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar equipe:', error);
    throw error;
  }
};

export default CreateEquipe;
