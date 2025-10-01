const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const CreateProfissional = async (profissionalData) => {
  try {
    const response = await fetch(`${API_URL}/profissionais`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(profissionalData),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar profissional');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar profissional:', error);
    throw error;
  }
};

export default CreateProfissional;
