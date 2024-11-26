import axios from "axios";

const Login = async (loginData) => {
    try {
        const url = import.meta.env.VITE_API_BASE_URL;
        const fullUrl = `${url}/auth/login`;
    
        const response = await axios.post(fullUrl, loginData);
    
        console.log("Login realizado:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        throw error;
    }
}

export default Login;
