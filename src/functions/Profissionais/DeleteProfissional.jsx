const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DeleteProfissional = async (profissionalId) => {
  try {
    const response = await fetch(`${API_URL}/profissionais/${profissionalId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar profissional');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao deletar profissional:', error);
    throw error;
  }
};

export default DeleteProfissional;
