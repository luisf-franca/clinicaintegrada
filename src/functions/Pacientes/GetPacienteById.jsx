import axios from 'axios';

const GetPacienteById = async (pacienteId) => {
    try {
        const url = import.meta.env.VITE_API_BASE_URL;
        const fullUrl = `${url}/pacientes/${pacienteId}`;
    
        // Obtém o token de autenticação
        const token = localStorage.getItem('token');
    
        // Faz a requisição GET com o cabeçalho de autenticação
        const response = await axios.get(fullUrl, {
        headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
        },
        });
    
        // console.log('Paciente encontrado:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar paciente:', error);
        throw error;
    }
}
