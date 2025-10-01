const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RemoverProfissionalEquipe = async ({ equipeId, profissionalId }) => {
  try {
    const response = await fetch(`${API_URL}/equipes/${equipeId}/profissionais/${profissionalId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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
