import { api } from '../../contexts/AuthContext';

const BloquearDesbloquearSala = async (salaId) => {
  try {
    const response = await api.put(`/salas/${salaId}/bloquear-desbloquear`, {});
    return response.data;
  } catch (error) {
    console.error('Erro ao bloquear/desbloquear sala:', error);
    throw error;
  }
};

export default BloquearDesbloquearSala;
