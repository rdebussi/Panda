import express from 'express';
import sequelize from './config/database.js';
import routes from './routes/index.js'; 
import { connectRedis } from './config/redis.js'; 
import cors from 'cors';


const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
  res.send('API de Autenticação Panda');
});


async function startServer() {
  try {
    await sequelize.sync(); 
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    await connectRedis()
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
}

startServer();