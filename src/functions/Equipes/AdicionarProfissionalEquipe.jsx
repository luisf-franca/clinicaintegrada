const API_URL = import.meta.env.VITE_API_BASE_URL;

const AdicionarProfissionalEquipe = async ({ equipeId, profissionalId }) => {
  try {
    const response = await fetch(`${API_URL}/equipes/${equipeId}/inserir-profissional/${profissionalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
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
