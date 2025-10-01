const API_URL = import.meta.env.VITE_API_BASE_URL;

const RemoverProfissionalEquipe = async ({ equipeId, profissionalId }) => {
  try {
    const response = await fetch(`${API_URL}/equipes/${equipeId}/remover-profissional/${profissionalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao remover profissional da equipe');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao remover profissional da equipe:', error);
    throw error;
  }
};

export default RemoverProfissionalEquipe;
