import axios from 'axios';

const BloquearDesbloquearSala = async (salaId) => {
    try {
        const url = import.meta.env.VITE_API_BASE_URL;
        const fullUrl = `${url}/salas/${salaId}/bloquear-desbloquear`;
    
        // Obtém o token de autenticação
        const token = localStorage.getItem('token');
    
        // Faz a requisição PUT com o cabeçalho de autenticação
        const response = await axios.put(fullUrl, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
            },
        });
    
        console.log('Sala bloqueada/desbloqueada:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao bloquear/desbloquear sala:', error);
        throw error;
    }
}

export default BloquearDesbloquearSala;