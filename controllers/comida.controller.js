import { comidaModel } from "../models/comida.model.js";
import message from '../utils/messages.js';

const {messageGeneral} = message;

const comidaCtrl = {};

comidaCtrl.createComida = async(req, res) => {
    try {
        const data = req.body;
        const resp = await comidaModel.create(data);
        messageGeneral(res,201,true,resp,"¡Platillo creado!");
      } catch (error) {
        messageGeneral(res,500,false,"",error.message);
      }
}

comidaCtrl.listAllComida=async(req,res)=>{
  try {
    //hace el inner join con el usuario y que no muestre el password.
    const resp= await comidaModel.find();
    messageGeneral(res,200,true,resp,"Lista de platillos");
  } catch (error) {
    messageGeneral(res,500,false,"",error.message);
  }
};

comidaCtrl.update = async(req,res) =>{
  try {
    const { id } = req.params;
    const resp = await comidaModel.findById(id);
    if(!resp){
      return messageGeneral(res,404,false,"","Platillo no encontrado");
    }
    await resp.updateOne(req.body);
    messageGeneral(res,200,true,"","Platillo actualizado!!!");
  } catch (error) {
    messageGeneral(res,500,false,"",error.message);
  }
};

comidaCtrl.deleteComida = async(req,res) =>{
  try {
    const { id } = req.params;
    const resp = await comidaModel.findById(id);
    if(!resp){
      return messageGeneral(res,404,false,"","Platillo no encontrado");
    }
    await resp.deleteOne();
    messageGeneral(res,200,true,"","Platillo eliminado!!!");
  } catch (error) {
    messageGeneral(res,500,false,"",error.message);
  }
};

comidaCtrl.updateComida = async(req,res) =>{
  try {
    const { key, value } = req.params;
    const actualizaciones = req.body;
    const searchValue = new RegExp(value, 'i');
    const resp = await comidaModel.findOneAndUpdate({ [key]: searchValue }, actualizaciones, { new: true });
    if(!resp){
      return messageGeneral(res,404,false,"","Platillo no encontrado");
    }
    messageGeneral(res,200,true,"","Platillo actualizado!!!");
  } catch (error) {
    messageGeneral(res,500,false,"",error.message);
  }
};

comidaCtrl.updateComidaMany = async(req,res) =>{
  try {
    const { key, value } = req.params;
    const actualizaciones = req.body;
    const searchValue = new RegExp(value, 'i');
    const resp = await comidaModel.updateMany({ [key]: searchValue }, actualizaciones);
    if(resp.matchedCount === 0){
      return messageGeneral(res,404,false,"","Platillo no encontrado");
    }
    messageGeneral(res,200,true,"","Platillo actualizado!!!");
  } catch (error) {
    messageGeneral(res,500,false,"",error.message);
  }
};


comidaCtrl.searchComida = async(req,res) =>{
  try {
    const { key, value } = req.params;
    const searchValue = new RegExp(value, 'i');
    const resp = await comidaModel.find({ [key]: searchValue });
    if (resp.length === 0) {
      return res.status(404).json({ message: 'No se encontraron platillos.' });
    }
    messageGeneral(res,200,true,resp,"Lista de platillos");
  } catch (error) {
    messageGeneral(res,500,false,"",error.message);
  }
};

export default comidaCtrl;