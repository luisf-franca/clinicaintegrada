import axios from "axios";

const DeleteAgendamento = async (agendamentoId) => {
    try {
        const url = import.meta.env.VITE_API_BASE_URL;
        const fullUrl = `${url}/agendamentos/${agendamentoId}`; // Constrói a URL com o ID do agendamento
    
        // Obtém o token de autenticação
        const token = localStorage.getItem("token");
    
        // Faz a requisição DELETE com o cabeçalho de autenticação
        const response = await axios.delete(fullUrl, {
            headers: {
                Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
            },
        });
    
        // console.log("Agendamento deletado:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erro ao deletar agendamento:", error);
        throw error;
    }
};

export default DeleteAgendamento;