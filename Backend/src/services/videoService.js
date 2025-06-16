import { redisClient } from '../config/redis.js';
import pandaApi from './pandaAPI.js';

export const findAllVideos = async (queryParams = {}) => {
  try {
    const sortedKeys = Object.keys(queryParams).sort();
    const queryString = sortedKeys.map(key => `${key}=${queryParams[key]}`).join('&');
    const cacheKey = `videos:${queryString || 'all'}`;
    
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Cache HIT! (Chave: ${cacheKey})`);
      return JSON.parse(cachedData);
    }

    console.log(`Cache MISS! (Chave: ${cacheKey}) Buscando na API da Panda...`);
    
    const response = await pandaApi.get('/videos', { params: queryParams });    
    const dataFromPanda = response.data;
    const videosArray = dataFromPanda?.videos || dataFromPanda;

    if (Array.isArray(videosArray)) {
      await redisClient.setEx(cacheKey, 20, JSON.stringify(dataFromPanda)); 
      console.log(`Dados de vídeos salvos no cache (Chave: ${cacheKey})`);
    } else {
      console.log('Resposta da API de vídeos vazia ou inválida, não salvando no cache.');
    }

    return dataFromPanda;

  } catch (error) {
    if (error.response) {
      console.error('Erro da API da Panda:', error.response.status, error.response.data);
    } else {
      console.error('Erro ao buscar vídeos:', error.message);
    }
    throw new Error('Não foi possível buscar os vídeos no momento.');
  }
};

export const findVideoById = async (videoId) => {
  try {
    const cacheKey = `video:${videoId}`;

    const cachedVideo = await redisClient.get(cacheKey);
    if (cachedVideo) {
      console.log(`Cache HIT para vídeo individual! (Chave: ${cacheKey})`);
      return JSON.parse(cachedVideo);
    }

    console.log(`Cache MISS para vídeo individual! (Chave: ${cacheKey}) Buscando na API da Panda...`);

    const response = await pandaApi.get(`/videos/${videoId}`);
    const videoFromPanda = response.data;

    if (videoFromPanda && videoFromPanda.id) {
      await redisClient.setEx(cacheKey, 20, JSON.stringify(videoFromPanda)); 
      console.log(`Dados do vídeo individual salvos no cache (Chave: ${cacheKey})`);
    }
    return videoFromPanda;
  } catch (error) {
    if (error.response) {
      console.error(`Erro da API da Panda (vídeo ${videoId}):`, error.response.status, error.response.data);
    } else {
      console.error(`Erro ao buscar vídeo ${videoId}:`, error.message);
    }
    throw new Error(`Não foi possível buscar o vídeo ${videoId} no momento.`);
  }
};

export const updateVideoById = async (videoId, updateData) => {
  try {
    const response = await pandaApi.put(`/videos/${videoId}`, updateData);
    const updatedVideoFromPanda = response.data;

    if (updatedVideoFromPanda && updatedVideoFromPanda.id) {
      const cacheKey = `video:${videoId}`;
      await redisClient.del(cacheKey);
    }

    return updatedVideoFromPanda;

  } catch (error) {
    if (error.response) {
      console.error(`Erro ao atualizar vídeo na API da Panda (ID: ${videoId}):`, error.response.status, error.response.data);
    } else {
      console.error(`Erro ao atualizar vídeo ${videoId}:`, error.message);
    }
    throw new Error(`Não foi possível atualizar o vídeo ${videoId}.`);
  }
};
