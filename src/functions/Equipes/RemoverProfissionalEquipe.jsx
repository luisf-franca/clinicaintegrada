import { api } from '../../contexts/AuthContext';

const RemoverProfissionalEquipe = async ({ equipeId, profissionalId }) => {
  try {
    const response = await api.put(`/equipes/${equipeId}/remover-profissional/${profissionalId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao remover profissional da equipe:', error);
    throw error;
  }
};

export default RemoverProfissionalEquipe;
