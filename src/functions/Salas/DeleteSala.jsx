const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DeleteSala = async (salaId) => {
  try {
    const response = await fetch(`${API_URL}/salas/${salaId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar sala');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao deletar sala:', error);
    throw error;
  }
};

export default DeleteSala;
