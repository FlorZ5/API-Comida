import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './database.js';
import comidaRoute from './routes/comida.route.js';
import userRoute from './routes/usuario.route.js';

connectDB();
//se crea la constante con la funcionalidad de la base de datos

//uso de express
const app = express();

//definir el puerto por el que va escuchar el servidor
app.set('Port',4000);
app.use(morgan('dev'));

//se establece la respuesta del servidor
//en formato json
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(cors({origen:'*'}));

app.use('/api/comida', comidaRoute);
app.use('/api/usuario',userRoute);

app.listen(app.get('Port'), ()=>{
  //console.log('Servidor escuchando por el puerto: ',app.get('Port'));
  console.log(`Servidor escuchando por el puerto ${app.get('Port')}`);
});

app.use('/',(req,res)=>{
  res.status(200).json({
    ok:true,
    message: "Mi primera petición a un servidor NodeJS!!",
  });
});