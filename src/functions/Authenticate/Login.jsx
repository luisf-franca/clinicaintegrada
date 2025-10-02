import { api } from '../../contexts/AuthContext';

const Login = async (loginData) => {
    try {
        const response = await api.post('/auth/login', loginData);
        return response.data;
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        throw error;
    }
}

export default Login;
