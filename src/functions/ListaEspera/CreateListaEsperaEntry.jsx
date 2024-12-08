import axios from 'axios';

const CreateListaEsperaEntry = async (pacienteId, listaEsperaData) => {
    try {
        const url = import.meta.env.VITE_API_BASE_URL;
        const fullUrl = `${url}/lista-espera/${pacienteId}`;

        // Obtém o token de autenticação
        const token = localStorage.getItem('token');

        // console.log(listaEsperaData);

        // Faz a requisição com os parâmetros e o cabeçalho de autenticação
        const response = await axios.post(fullUrl, listaEsperaData, {
            headers: {
                Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
            },
        });

        // console.log('Entrada na lista de espera criada:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar entrada na lista de espera:', error);
        throw error;
    }
};

export default CreateListaEsperaEntry;