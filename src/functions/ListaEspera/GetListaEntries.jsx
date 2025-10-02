import { api } from '../../contexts/AuthContext';

const GetListaEntries = async (options = {}) => {
  try {
    const { page, pageSize, filter, orderBy } = options;

    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (pageSize) params.append('pageSize', pageSize);
    if (filter) params.append('filter', filter);
    if (orderBy) params.append('orderBy', orderBy);

    const response = await api.get('/lista-espera', { params });

    // Retorna a estrutura completa para paginação
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar registros da lista de espera:', error);
    throw error;
  }
};

export default GetListaEntries;
