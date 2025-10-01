const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DeleteEquipe = async (equipeId) => {
  try {
    const response = await fetch(`${API_URL}/equipes/${equipeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar equipe');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao deletar equipe:', error);
    throw error;
  }
};

export default DeleteEquipe;
