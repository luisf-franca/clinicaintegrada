const API_URL = import.meta.env.VITE_API_BASE_URL;

const CreateEquipe = async (equipeData) => {
  try {
    const response = await fetch(`${API_URL}/equipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(equipeData),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar equipe');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar equipe:', error);
    throw error;
  }
};

export default CreateEquipe;
