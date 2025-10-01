const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const UpdateProfissional = async (profissionalId, profissionalData) => {
  try {
    const response = await fetch(`${API_URL}/profissionais/${profissionalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(profissionalData),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar profissional');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error);
    throw error;
  }
};

export default UpdateProfissional;
