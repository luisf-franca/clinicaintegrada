import axios from 'axios';

const CreatePaciente = async (pacienteData) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/pacientes`;

    // Obtém o token de autenticação
    const token = localStorage.getItem('token');

    console.log(pacienteData);

    // Faz a requisição com os parâmetros e o cabeçalho de autenticação
    const response = await axios.post(fullUrl, pacienteData, {
      headers: {
        Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
      },
    });

    console.log('Paciente criado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    throw error;
  }
};

export default CreatePaciente;
