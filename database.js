import mongoose, { Mongoose } from "mongoose";
const uri = "mongodb://127.0.0.1:27017/comida"; 
//Creamos la conexión
const connectDB=async()=>{
  try {
    const db = await mongoose.connect(uri);
    console.log('Base de datos conectada: ',db.connection.name);
  } catch (error) {
    console.log('Error:',error.message);
  }
}

export default connectDB;