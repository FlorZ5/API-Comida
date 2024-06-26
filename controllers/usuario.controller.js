import { UserModel } from "../models/usuario.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import messages from "../utils/messages.js";

const {messageGeneral} = messages;
const userCtrl={};

userCtrl.register=async(req,res)=>{
  try {
    const data=req.body;
    const resp= await UserModel.findOne({correo:data.correo});
    if(resp){
      return messageGeneral(res,400,false,"","El correo ya existe");
    }
    data.password = await bcrypt.hash(data.password,10);
    const newUser = await UserModel.create(data);
    const token= jwt.sign({_id:newUser._id},"secreta");
    messageGeneral(res,201,true,{...newUser._doc,password:null,token},
      "El usuario se creó correctamente!!!");
  } catch (error) {
    messageGeneral(res,500,false,"",error.message);
  }
}

userCtrl.login = async(req,res) =>{
  try {
    const data=req.body;
    const resp = await UserModel.findOne({correo:data.correo});
    if (!resp){
      return messageGeneral(res,400,false,"","El correo no existe");
    }

    //reconvertir la contraseña encriptada para compararla
    const match = await bcrypt.compare(data.password, resp.password);


    if (match) { //Si los valores coinciden generará el token y lo enviará
      // Generar token JWT
    const token = jwt.sign({_id:resp._id}, 'secreta', { expiresIn: '1h' }); // Puedes ajustar el tiempo de expiración según tus necesidades

    return messageGeneral(res, 201, true, {...resp._doc, password:null, token}, "¡¡¡Bienvenido!!!"); // Enviar respuesta con el token y otros datos del usuario
    }

    messageGeneral(res,400,false,"","La contraseña es incorrecta!!!");
  } catch (error) {
    messageGeneral(res,500,false,"",error.message);
  }
}
export default userCtrl;