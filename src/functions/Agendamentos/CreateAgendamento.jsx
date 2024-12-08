import axios from 'axios';

const CreateAgendamento = async (agendamentoData) => {
    try {
        const url = import.meta.env.VITE_API_BASE_URL;
        const fullUrl = `${url}/agendamentos/consulta-triagem`;

        // Obtém o token de autenticação
        const token = localStorage.getItem('token');

        // console.log(agendamentoData);

        // Faz a requisição com os parâmetros e o cabeçalho de autenticação
        const response = await axios.post(fullUrl, agendamentoData, {
            headers: {
                Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
            },
        });

        // console.log('Agendamento criado:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        throw error;
    }
};

export default CreateAgendamento;