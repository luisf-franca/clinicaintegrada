import { api } from '../../contexts/AuthContext';

const GetEquipes = async (options = {}) => {
  try {
    const { page, pageSize, filter, orderBy } = options;

    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (pageSize) params.append('pageSize', pageSize);
    if (filter) params.append('filter', filter);
    if (orderBy) params.append('orderBy', orderBy);

    const response = await api.get('/equipes', { params });

    // Retorna a estrutura completa para paginação
    console.log('Response from GetEquipes:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar equipes:', error);
    throw error;
  }
};

export default GetEquipes;
