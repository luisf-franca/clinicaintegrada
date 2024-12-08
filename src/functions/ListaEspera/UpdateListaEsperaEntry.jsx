import axios from 'axios';

const UpdateListaEsperaEntry = async (entryId, entryData) => {
    try {
        const url = import.meta.env.VITE_API_BASE_URL;
        const fullUrl = `${url}/lista-espera/${entryId}`; // Constrói a URL com o ID da entrada na lista de espera

        // Obtém o token de autenticação
        const token = localStorage.getItem('token');

        // console.log(entryData);

        // Faz a requisição PUT com os parâmetros e o cabeçalho de autenticação
        const response = await axios.put(fullUrl, entryData, {
            headers: {
                Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
            },
        });

        // console.log('Entrada na lista de espera atualizada:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar entrada na lista de espera:', error);
        throw error;
    }
};

export default UpdateListaEsperaEntry;