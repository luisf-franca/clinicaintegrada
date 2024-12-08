import axios from "axios";

const DeletePaciente = async (pacienteId) => {
    try {
        const url = import.meta.env.VITE_API_BASE_URL;
        const fullUrl = `${url}/pacientes/${pacienteId}`; // Constrói a URL com o ID do paciente
    
        // Obtém o token de autenticação
        const token = localStorage.getItem("token");
    
        // Faz a requisição DELETE com o cabeçalho de autenticação
        const response = await axios.delete(fullUrl, {
        headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
        },
        });
    
        // console.log("Paciente deletado:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erro ao deletar paciente:", error);
        throw error;
    }
};

export default DeletePaciente; 