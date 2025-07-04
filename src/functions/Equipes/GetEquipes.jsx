import axios from 'axios';

const GetEquipes = async (options = {}) => {
  try {
    const { page, pageSize, filter, orderBy } = options;

    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (pageSize) params.append('pageSize', pageSize);
    if (filter) params.append('filter', filter);
    if (orderBy) params.append('orderBy', orderBy);

    const url = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${url}/equipes?${params.toString()}`;

    const token = localStorage.getItem('token');

    const response = await axios.get(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Retorna a estrutura completa para paginação
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar equipes:', error);
    throw error;
  }
};

export default GetEquipes;
