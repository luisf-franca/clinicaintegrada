import { api } from '../../contexts/AuthContext';

const PutConsultaObservacoesById = async (consultaId, observacoes) => {
    try {
        const response = await api.put(`/consultas/${consultaId}/observacoes`, { observacoes });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar consulta:', error);
        throw error;
    }
};

export default PutConsultaObservacoesById;
