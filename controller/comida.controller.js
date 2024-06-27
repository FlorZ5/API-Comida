import { comidaModel } from "../models/comida.model.js";
import message from '../utils/messages.js';

const {messageGeneral} = message;

const comidaCtrl = {};

// Estas son las validaciones.
const valNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,40}$/;
const valCategoria = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,40}$/;
const valIngredientes = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]{3,40}$/;
const valDescripcion = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s,]{3,100}$/;
const valPrecio = /^\d+(\.\d{1,2})?$/;

comidaCtrl.createComida = async (req, res) => {
  try {
    const data = req.body;

    if (!valNombre.test(data.nombre)) {
      return messageGeneral(res, 400, false, "", "El formato ingresado para el nombre es inválido.");
    }

    if (!valCategoria.test(data.categoria)) {
      return messageGeneral(res, 400, false, "", "El formato ingresado para la categoría es inválido.");
    }

    if (!valIngredientes.test(data.ingredientes)) {
      return messageGeneral(res, 400, false, "", "El formato ingresado para los ingredientes es inválido.");
    }

    if (!valDescripcion.test(data.descripcion)) {
      return messageGeneral(res, 400, false, "", "El formato ingresado para la descripción es inválido.");
    }

    if (!valPrecio.test(data.precio)) {
      return messageGeneral(res, 400, false, "", "El formato ingresado para el precio es inválido.");
    }

    const resp = await comidaModel.create(req.body);
    messageGeneral(res, 201, true, resp, "¡Platillo creado!");
  } catch (error) {
    messageGeneral(res, 500, false, "", error.message);
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

comidaCtrl.searchComida = async(req,res) =>{
  try {
    const { key, value } = req.params;
    const searchValue = new RegExp(value, 'i');
    const searchKey = key.toLowerCase();
    const resp = await comidaModel.find({ [searchKey]: searchValue });
    if (resp.length === 0) {
      return res.status(404).json({ message: 'No se encontraron platillos.' });
    }
    messageGeneral(res,200,true,resp,"Lista de platillos");
  } catch (error) {
    messageGeneral(res,500,false,"",error.message);
  }
};


comidaCtrl.updateComida = async (req, res) => {
  try {
    const { key, value } = req.params;
    const actualizaciones = req.body;
    const searchValue = new RegExp(value, 'i');
    const searchKey = key.toLowerCase();

    // Ingresas el valor del key a un switch para determinar la validación a ejecutar.
    let validationKey;
    switch (searchKey) {
      case 'nombre':
        validationKey = valNombre;
        break;
      case 'categoria':
        validationKey = valCategoria;
        break;
      case 'ingredientes':
        validationKey = valIngredientes;
        break;
      case 'descripcion':
        validationKey = valDescripcion;
        break;
      case 'precio':
        validationKey = valPrecio;
        break;
      default:
        return messageGeneral(res, 400, false, "", "Campo a actualizar no válido");
    }

    // Validas el valor que se está intentando actualizar
    for (const field in actualizaciones) {
      if (actualizaciones.hasOwnProperty(field)) {
        if (!validationKey.test(actualizaciones[field])) {
          return messageGeneral(res, 400, false, "", `El formato ingresado para ${field} es inválido.`);
        }
      }
    }

    const resp = await comidaModel.findOneAndUpdate({ [searchKey]: searchValue }, actualizaciones, { new: true });

    if (!resp) {
      return messageGeneral(res, 404, false, "", "Platillo no encontrado");
    }

    messageGeneral(res, 200, true, "", "Platillo actualizado!!!");
  } catch (error) {
    messageGeneral(res, 500, false, "", error.message);
  }
};

comidaCtrl.updateComidaMany = async (req, res) => {
  try {
    const { key, value } = req.params;
    const actualizaciones = req.body;
    const searchValue = new RegExp(value, 'i');
    const searchKey = key.toLowerCase();

    // Ingresas el valor del key a un switch para determinar la validación a ejecutar.
    let validationRegex;
    switch (searchKey) {
      case 'nombre':
        validationRegex = valNombre;
        break;
      case 'categoria':
        validationRegex = valCategoria;
        break;
      case 'ingredientes':
        validationRegex = valIngredientes;
        break;
      case 'descripcion':
        validationRegex = valDescripcion;
        break;
      case 'precio':
        validationRegex = valPrecio;
        break;
      default:
        return messageGeneral(res, 400, false, "", "Campo a actualizar no válido");
    }

    // Validas cada valor que se está intentando actualizar
    for (const field in actualizaciones) {
      if (actualizaciones.hasOwnProperty(field)) {
        if (!validationRegex.test(actualizaciones[field])) {
          return messageGeneral(res, 400, false, "", `El formato ingresado para ${field} es inválido.`);
        }
      }
    }

    const resp = await comidaModel.updateMany({ [searchKey]: searchValue }, actualizaciones);

    if (resp.matchedCount === 0) {
      return messageGeneral(res, 404, false, "", "Platillo no encontrado");
    }

    messageGeneral(res, 200, true, "", "Platillos actualizados!!!");
  } catch (error) {
    messageGeneral(res, 500, false, "", error.message);
  }
};

comidaCtrl.deleteComida = async(req,res) =>{
  try {
    const { key, value } = req.params;
    const keyM = key.toLowerCase();
    const query = {};
    query[keyM] = new RegExp(value, 'i'); // 'i' hace que la búsqueda no sea sensible a mayúsculas/minúsculas
    const resp = await comidaModel.findOneAndDelete(query);
    if(resp.deletedCount === 0){
      return messageGeneral(res,404,false,"","Platillo no encontrado");
    }
    messageGeneral(res,200,true,"","Platillo eliminado!!!");
  } catch (error) {
    messageGeneral(res,500,false,"",error.message);
  }
};

comidaCtrl.deleteComidaMany = async(req,res) =>{
  try {
    const { key, value } = req.params;
    const searchValue = new RegExp(value, 'i');// 'i' hace que la búsqueda no sea sensible a mayúsculas/minúsculas
    const searchKey = key.toLowerCase();
    const resp = await comidaModel.deleteMany({ [searchKey]: searchValue });
    if(resp.deletedCount === 0){
      return messageGeneral(res,404,false,"","Platillo no encontrado");
    }
    messageGeneral(res,200,true,"","Platillo eliminado!!!");
  } catch (error) {
    messageGeneral(res,500,false,"",error.message);
  }
};

export default comidaCtrl;