import axios from 'axios';

const GetAgendamentos = async (options = {}) => {
    try {
        // Extrai os parâmetros opcionais
        const { page, pageSize, filter, orderBy } = options;

        // Monta a query string com os parâmetros opcionais
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (pageSize) params.append('pageSize', pageSize);
        if (filter) params.append('filter', filter);
        if (orderBy) params.append('orderBy', orderBy);

        // Monta a URL completa com a query string
        const url = import.meta.env.VITE_API_BASE_URL;
        const fullUrl = `${url}/agendamentos?${params.toString()}`;

        // Obtém o token de autenticação
        const token = localStorage.getItem('token');
        
        console.log(token);

        // Faz a requisição com os parâmetros e o cabeçalho de autenticação
        const response = await axios.get(fullUrl, {
            headers: {
                Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
            },
        });

        return response.data.data.items;
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        throw error;
    }
}

export default GetAgendamentos;