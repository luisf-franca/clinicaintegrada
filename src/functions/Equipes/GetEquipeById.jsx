const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const GetEquipeById = async (equipeId) => {
  try {
    const response = await fetch(`${API_URL}/equipes/${equipeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar equipe');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar equipe:', error);
    throw error;
  }
};

export default GetEquipeById;
