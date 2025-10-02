import { api } from '../../contexts/AuthContext';

const GetPacientes = async (options = {}) => {
  try {
    const { page, pageSize, filter, orderBy } = options;

    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (pageSize) params.append('pageSize', pageSize);
    if (filter) params.append('filter', filter);
    if (orderBy) params.append('orderBy', orderBy);

    const response = await api.get(`/pacientes`, { params });
    //console.log(response.data.data);
    return response.data.data;
    
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    // O ideal aqui é ter um interceptor no Axios para tratar erros 401 (não autorizado)
    // e deslogar o usuário automaticamente.
    throw error;
  }
};

export default GetPacientes;
