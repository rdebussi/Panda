import { redisClient } from '../config/redis.js';
import pandaApi from './pandaAPI.js';

export const findAllFolders = async (queryParams = {}) => {
  try {
    const sortedKeys = Object.keys(queryParams).sort();
    const queryString = sortedKeys.map(key => `${key}=${queryParams[key]}`).join('&');
    const cacheKey = `folders:${queryString || 'all'}`;

    const cachedFolders = await redisClient.get(cacheKey);
    if (cachedFolders) {
      console.log(`Cache HIT para pastas! (Chave: ${cacheKey})`);
      return JSON.parse(cachedFolders);
    }

    console.log(`Cache MISS para pastas! (Chave: ${cacheKey}) Buscando na API da Panda...`);
    
    const response = await pandaApi.get('/folders', { params: queryParams });
    
    const dataFromPanda = response.data;
    const foldersArray = dataFromPanda?.folders || dataFromPanda;

    if (Array.isArray(foldersArray)) {
      await redisClient.setEx(cacheKey, 20, JSON.stringify(dataFromPanda));
      console.log(`Dados de pastas salvos no cache (Chave: ${cacheKey})`);
    } else {
      console.log('Resposta da API de pastas vazia ou inválida, não salvando no cache.');
    }

    return dataFromPanda;

  } catch (error) {
    if (error.response) {
      console.error('Erro da API da Panda (pastas):', error.response.status, error.response.data);
    } else {
      console.error('Erro ao buscar pastas:', error.message);
    }
    throw new Error('Não foi possível buscar as pastas no momento.');
  }
};

export const findFolderById = async (folderId) => {
  try {
    const cacheKey = `folder:${folderId}`;
    const cachedFolder = await redisClient.get(cacheKey);

    if (cachedFolder) {
      console.log(`Cache HIT para pasta individual! (Chave: ${cacheKey})`);
      return JSON.parse(cachedFolder);
    }

    console.log(`Cache MISS para pasta individual! (Chave: ${cacheKey}) Buscando na API da Panda...`);

    const response = await pandaApi.get(`/folders/${folderId}`);
    const folderFromPanda = response.data;

    if (folderFromPanda && folderFromPanda.id) {
      await redisClient.setEx(cacheKey, 20, JSON.stringify(folderFromPanda));
      console.log(`Dados da pasta individual salvos no cache (Chave: ${cacheKey})`);
    }

    return folderFromPanda;

  } catch (error) {
    if (error.response) {
      console.error(`Erro da API da Panda (pasta ${folderId}):`, error.response.status, error.response.data);
    } else {
      console.error(`Erro ao buscar pasta ${folderId}:`, error.message);
    }
    throw new Error(`Não foi possível buscar a pasta ${folderId} no momento.`);
  }
};

export const findRootFolders = async () => {
  const allFoldersData = await findAllFolders();
  const allFoldersArray = allFoldersData?.folders || allFoldersData;
  if (Array.isArray(allFoldersArray)) {
    const rootFolders = allFoldersArray.filter(folder => folder.parent_folder_id === null);
    return rootFolders;
  }
  return [];
};
