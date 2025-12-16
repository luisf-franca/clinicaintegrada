import { api } from '../../contexts/AuthContext';

const GetSalasAtivas = async () => {
    try {
        const response = await api.get('/salas/ativas');

        return response.data.data;
    } catch (error) {
        console.error('Erro ao buscar salas:', error);
        throw error;
    }
};

export default GetSalasAtivas;
