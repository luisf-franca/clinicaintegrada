import { api } from '../../contexts/AuthContext';

const DeleteProfissional = async (profissionalId) => {
  try {
    const response = await api.delete(`/profissionais/${profissionalId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar profissional:', error);
    throw error;
  }
};

export default DeleteProfissional;
