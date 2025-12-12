import { api } from '../../contexts/AuthContext';

const GetProfissionais = async (options = {}) => {
  try {
    const { page = 1, pageSize = 10, filter } = options;

    const params = new URLSearchParams();
    params.append('page', page);
    params.append('pageSize', pageSize);
    if (filter) {
      params.append('filter', filter);
    }

    //console.log('Fetching professionals with options:', options);

    const response = await api.get('/profissionais', { params });

    const data = response.data;
    // console.log('Data from GetProfissionais:', data);
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    throw error;
  }
};

export default GetProfissionais;
