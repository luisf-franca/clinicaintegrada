import { api } from '../../contexts/AuthContext';

const CreateSala = async (salaData) => {
  try {
    const response = await api.post('/salas', salaData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar sala:', error);
    throw error;
  }
};

export default CreateSala;
