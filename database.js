import mongoose from 'mongoose';

const uri = "mongodb+srv://2136000607:Galleta06@cluster0.9pd4gyf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // URI de conexión a MongoDB Atlas

// Creamos la conexión
const connectDB = async () => {
  try {
    const db = await mongoose.connect(uri);
    console.log('Base de datos conectada:', db.connection.name);
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error.message);
    process.exit(1); // Termina la ejecución del proceso en caso de error de conexión
  }
}

export default connectDB;