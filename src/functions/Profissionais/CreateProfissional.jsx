import { api } from '../../contexts/AuthContext';

const CreateProfissional = async (profissionalData) => {
  try {
    const response = await api.post('/profissionais', profissionalData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar profissional:', error);
    throw error;
  }
};

export default CreateProfissional;
