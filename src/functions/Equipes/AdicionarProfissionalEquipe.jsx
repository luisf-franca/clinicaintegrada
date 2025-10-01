const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdicionarProfissionalEquipe = async ({ equipeId, profissionalId }) => {
  try {
    const response = await fetch(`${API_URL}/equipes/${equipeId}/profissionais`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ profissionalId }),
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar profissional à equipe');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao adicionar profissional à equipe:', error);
    throw error;
  }
};

export default AdicionarProfissionalEquipe;
