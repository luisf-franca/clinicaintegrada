import axios from 'axios';

const IniciarConsulta = async (consultaId) => {
    try {
        const url = import.meta.env.VITE_API_BASE_URL;
        const fullUrl = `${url}/consultas/${consultaId}/iniciar`;

        // Obtém o token de autenticação
        const token = localStorage.getItem('token');

        // Faz a requisição PUT com o cabeçalho de autenticação
        const response = await axios.put(fullUrl, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
            },
        });

        // console.log('Consulta iniciada:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao iniciar consulta:', error);
        throw error;
    }
}

export default IniciarConsulta;