import axios from 'axios';

const UpdatePaciente = async (pacienteId, pacienteData) => {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/pacientes/${pacienteId}`; // Constrói a URL com o ID do paciente

    // Obtém o token de autenticação
    const token = localStorage.getItem('token');

    // console.log(pacienteData);

    // Faz a requisição PUT com os parâmetros e o cabeçalho de autenticação
    const response = await axios.put(fullUrl, pacienteData, {
      headers: {
        Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
      },
    });

    // console.log('Paciente atualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    throw error;
  }
};

export default UpdatePaciente;
