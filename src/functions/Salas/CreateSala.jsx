const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CreateSala = async (salaData) => {
  try {
    const response = await fetch(`${API_URL}/salas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(salaData),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar sala');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar sala:', error);
    throw error;
  }
};

export default CreateSala;
