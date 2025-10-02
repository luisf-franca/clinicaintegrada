import { api } from '../../contexts/AuthContext';

const GetSalas = async (options = {}) => {
  try {
    const { page, pageSize, filter, orderBy } = options;

    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (pageSize) params.append('pageSize', pageSize);
    if (filter) params.append('filter', filter);
    if (orderBy) params.append('orderBy', orderBy);

    const response = await api.get('/salas', { params });

    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar salas:', error);
    throw error;
  }
};

export default GetSalas;
