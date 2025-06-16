import axios from 'axios';

const pandaApi = axios.create({
  baseURL: 'https://api-v2.pandavideo.com.br',
});

pandaApi.interceptors.request.use(
  (config) => {
    const apiKey = process.env.PANDA_API_KEY;
    if (apiKey) {
      config.headers['Authorization'] = apiKey;
      config.headers['Accept'] = 'application/json';
    } else {
      console.error('PANDA_API_KEY não foi encontrada nas variáveis de ambiente!');
    }    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default pandaApi;
