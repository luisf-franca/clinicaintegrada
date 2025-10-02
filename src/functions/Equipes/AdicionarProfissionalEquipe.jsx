import { api } from '../../contexts/AuthContext';

const AdicionarProfissionalEquipe = async ({ equipeId, profissionalId }) => {
  try {
    const response = await api.put(`/equipes/${equipeId}/inserir-profissional/${profissionalId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar profissional à equipe:', error);
    throw error;
  }
};

export default AdicionarProfissionalEquipe;
