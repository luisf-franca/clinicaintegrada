const API_URL = import.meta.env.VITE_API_BASE_URL;

const GetProfissionais = async (options = {}) => {
  try {
    const { page = 1, pageSize = 10, filter } = options;
    
    let url = `${API_URL}/profissionais?page=${page}&pageSize=${pageSize}`;
    
    console.log('Fetching professionals with options:', options);

    if (filter) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar profissionais');
    }

    const data = await response.json();
    // console.log('Data from GetProfissionais:', data);
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    throw error;
  }
};

export default GetProfissionais;
