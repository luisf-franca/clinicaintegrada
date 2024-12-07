import axios from "axios";

const DeleteListaEsperaEntry = async (entryId) => {
    try {
        const url = import.meta.env.VITE_API_BASE_URL;
        const fullUrl = `${url}/lista-espera/${entryId}`; // Constrói a URL com o ID da entrada
    
        // Obtém o token de autenticação
        const token = localStorage.getItem("token");
    
        // Faz a requisição DELETE com o cabeçalho de autenticação
        const response = await axios.delete(fullUrl, {
            headers: {
                Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
            },
        });
    
        console.log("Entrada da lista de espera deletada:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erro ao deletar entrada da lista de espera:", error);
        throw error;
    }
};

export default DeleteListaEsperaEntry;