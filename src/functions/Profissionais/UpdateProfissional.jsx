import { api } from '../../contexts/AuthContext';

const UpdateProfissional = async (profissionalId, profissionalData) => {
  try {
    const response = await api.put(`/profissionais/${profissionalId}`, profissionalData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error);
    throw error;
  }
};

export default UpdateProfissional;
