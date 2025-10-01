const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const UpdateSala = async (salaId, salaData) => {
  try {
    const response = await fetch(`${API_URL}/salas/${salaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(salaData),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar sala');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar sala:', error);
    throw error;
  }
};

export default UpdateSala;
