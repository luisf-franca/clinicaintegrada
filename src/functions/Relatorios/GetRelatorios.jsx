import { api } from '../../contexts/AuthContext';

const GetRelatorios = async () => {
    try {
        const response = await api.get('/relatorios');

        const data = response.data;
        console.log('Data from GetRelatorios:', data);
        return data.data;
    } catch (error) {
        console.error('Erro ao buscar relatorios:', error);
        throw error;
    }
};

export default GetRelatorios;
