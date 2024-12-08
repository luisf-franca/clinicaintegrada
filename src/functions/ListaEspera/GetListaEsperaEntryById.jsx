import axios from 'axios';

const GetListaEsperaEntryById = async (entryId) => {
    try {
        const url = import.meta.env.VITE_API_BASE_URL;
        const fullUrl = `${url}/lista-espera/${entryId}`;
    
        // Obtém o token de autenticação
        const token = localStorage.getItem('token');
    
        // Faz a requisição GET com o cabeçalho de autenticação
        const response = await axios.get(fullUrl, {
            headers: {
                Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
            },
        });
    
        // console.log('Entrada da lista de espera encontrada:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar entrada da lista de espera:', error);
        throw error;
    }
}

export default GetListaEsperaEntryById;