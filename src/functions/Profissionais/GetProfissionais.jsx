const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const GetProfissionais = async (options = {}) => {
  try {
    const { page = 1, pageSize = 10, filter } = options;
    
    let url = `${API_URL}/profissionais?page=${page}&pageSize=${pageSize}`;
    
    if (filter) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar profissionais');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    throw error;
  }
};

export default GetProfissionais;
