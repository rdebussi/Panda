import { createClient } from 'redis';

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`
});

redisClient.on('error', (err) => {
  console.error('Erro no Cliente Redis:', err);
});

redisClient.on('connect', () => {
  console.log('Cliente Redis conectado com sucesso.');
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Falha ao conectar com o Redis:', err);
  }
};

export { redisClient, connectRedis };