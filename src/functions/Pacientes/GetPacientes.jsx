import axios from 'axios';

const GetPacientes = async (options = {}) => {
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
    const fullUrl = `${url}/pacientes?${params.toString()}`;

    // Obtém o token de autenticação
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImF0ZW5kZW50ZUB1c2VyLmNvbS5iciIsImp0aSI6IjYyNzc0YTU3LWIyOGItNDAzMi1hMTIyLWMyYTRjZTdlMzVmYSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhdGVuZGVudGVAdXNlci5jb20uYnIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJhdGVuZGVudGUiLCJleHAiOjE3MzI1NzYzMTMsImlzcyI6IkNsaW5pY2FJbnRlZ3JhZGFfSXNzdWVyIiwiYXVkIjoiQ2xpbmljYUludGVncmFkYV9BdWRpZW5jZSJ9.YB-4cv93dX9Ed_hvoFANnwHq8R5i_VjpSgTjFgAi7es';

    // Faz a requisição com os parâmetros e o cabeçalho de autenticação
    const response = await axios.get(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
      },
    });

    console.log('response:', response);
    return response.data.data.items;
    // return response.data;
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    throw error;
  }
};

export default GetPacientes;
