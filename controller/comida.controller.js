import { comidaModel } from "../models/comida.model.js";
import message from '../utils/messages.js';

const {messageGeneral} = message;

const comidaCtrl = {};

// Estas son las validaciones.
const valNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,40}$/;
const valCategoria = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,40}$/;
const valIngredientes = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]{3,40}$/;
const valDescripcion = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s,]{3,100}$/;
const valPrecio = /^\d+$/;
const valCodigo = /^\d{1,6}$/;

comidaCtrl.createComida = async (req, res) => {
  try {
    const data = req.body;

    const allowedFields = ['nombre', 'categoria', 'ingredientes', 'descripcion', 'precio'];

    const invalidFields = Object.keys(data).filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
      return messageGeneral(res, 400, false, "", `Campos no permitidos: ${invalidFields.join(', ')}`);
    }

    //Valida que ningún campo venga vacío
    const requiredFields = ['nombre', 'categoria', 'ingredientes', 'descripcion', 'precio'];
    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === "") {
        return messageGeneral(res, 400, false, "", `El campo ${field} no puede estar vacío.`);
      }
    }

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

    const maxCodigo = await comidaModel.findOne().sort('-codigo').select('codigo');
    const codigo = maxCodigo ? maxCodigo.codigo + 1 : 1;


    const newData = {
      ...data,
      codigo
    };

    const resp = await comidaModel.create(newData);
    messageGeneral(res, 201, true, resp, `¡Platillo creado!, código de identificación: ${codigo}` );
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

comidaCtrl.searchComida = async (req, res) => {
  try {
    const { key, value } = req.params;
    const searchKey = key.toLowerCase();
    let searchValue;

    // Validar el campo y el valor de búsqueda
    switch (searchKey) {
      case 'nombre':
        if (!valNombre.test(value)) {
          return messageGeneral(res, 400, false, "", "El formato ingresado para el nombre es inválido.");
        }
        searchValue = new RegExp(value, 'i');
        break;
      case 'categoria':
        if (!valCategoria.test(value)) {
          return messageGeneral(res, 400, false, "", "El formato ingresado para la categoría es inválido.");
        }
        searchValue = new RegExp(value, 'i');
        break;
      case 'ingredientes':
        if (!valIngredientes.test(value)) {
          return messageGeneral(res, 400, false, "", "El formato ingresado para los ingredientes es inválido.");
        }
        searchValue = new RegExp(value, 'i');
        break;
      case 'descripcion':
        if (!valDescripcion.test(value)) {
          return messageGeneral(res, 400, false, "", "El formato ingresado para la descripción es inválido.");
        }
        searchValue = new RegExp(value, 'i');
        break;
      case 'precio':
        if (!valPrecio.test(value)) {
          return messageGeneral(res, 400, false, "", "El formato ingresado para el precio es inválido.");
        }
        searchValue = parseFloat(value); // Convierte el valor a float para que no tengas problemas
        break;
      case 'codigo':
        if (!valCodigo.test(value)) {
          return messageGeneral(res, 400, false, "", "El formato ingresado para el código es inválido.");
        }
        searchValue = parseInt(value, 10); // Convierte el valor a número entero para que coincida con el modelo que le creaste :)
        break;
      default:
        return messageGeneral(res, 400, false, "", "Campo de búsqueda no válido.");
    }

    const query = { [searchKey]: searchValue };
    const resp = await comidaModel.find(query);

    if (resp.length === 0) {
      return res.status(404).json({ message: 'No se encontraron platillos.' });
    }

    messageGeneral(res, 200, true, resp, "Lista de platillos");
  } catch (error) {
    messageGeneral(res, 500, false, "", error.message);
  }
};


comidaCtrl.updateComida = async (req, res) => {
  try {
    const { key, value } = req.params;
    const actualizaciones = req.body;
    const searchKey = key.toLowerCase();
    let searchValue;

    const camposValidos = ['nombre', 'categoria', 'ingredientes', 'descripcion', 'precio', 'codigo'];
    if (!camposValidos.includes(searchKey)) {
      return messageGeneral(res, 400, false, "", "Campo a buscar no válido.");
    }

    if ('codigo' in actualizaciones) {
      return messageGeneral(res, 400, false, "", "El campo código no puede ser actualizado.");
    }

    // Determinar la validación a ejecutar según el campo de búsqueda
    let validationKey;
    switch (searchKey) {
      case 'nombre':
        validationKey = valNombre;
        searchValue = new RegExp(value, 'i');
        break;
      case 'categoria':
        validationKey = valCategoria;
        searchValue = new RegExp(value, 'i');
        break;
      case 'ingredientes':
        validationKey = valIngredientes;
        searchValue = new RegExp(value, 'i');
        break;
      case 'descripcion':
        validationKey = valDescripcion;
        searchValue = new RegExp(value, 'i');
        break;
      case 'codigo':
        if (!valCodigo.test(value)) {
           return messageGeneral(res, 400, false, "", "El valor ingresado para código no es válido. Debe ser un número entero positivo.");
         }
        searchValue = parseInt(value);
         break;
         case 'precio':
          validationKey = valPrecio;
          if (!/^\d+$/.test(value)) {
            return messageGeneral(res, 400, false, "", "El valor ingresado para precio no es válido. Debe ser un número entero positivo.");
          }
          searchValue = parseInt(value, 10);
          break;
      default:
        return messageGeneral(res, 400, false, "", "Campo a actualizar no válido");
    }

    // Validar los campos que se están actualizando
    for (const field in actualizaciones) {
      if (actualizaciones.hasOwnProperty(field)) {
        let validation;
        switch (field) {
          case 'nombre':
            validation = valNombre;
            break;
          case 'categoria':
            validation = valCategoria;
            break;
          case 'ingredientes':
            validation = valIngredientes;
            break;
          case 'descripcion':
            validation = valDescripcion;
            break;
            case 'precio':
              if (!/^\d+$/.test(actualizaciones[field])) {
                return messageGeneral(res, 400, false, "", `El formato ingresado para ${field} es inválido. Debe ser un número entero.`);
              }
              actualizaciones[field] = parseInt(actualizaciones[field], 10);
              continue;                       
          default:
            return messageGeneral(res, 400, false, "", `Campo ${field} no válido para actualizar.`);
        }

        if (!validation.test(actualizaciones[field])) {
          return messageGeneral(res, 400, false, "", `El formato ingresado para ${field} es inválido.`);
        }
      }
    }

    const resp = await comidaModel.findOneAndUpdate({ [searchKey]: searchValue }, actualizaciones, { new: true });

    if (!resp) {
      return messageGeneral(res, 404, false, "", "Platillo no encontrado");
    }

    messageGeneral(res, 200, true, resp, "Platillo actualizado!!!");
  } catch (error) {
    messageGeneral(res, 500, false, "", error.message);
  }
};



comidaCtrl.updateComidaMany = async (req, res) => {
  try {
    const { key, value } = req.params;
    const actualizaciones = req.body;
    const searchKey = key.toLowerCase();
    let searchValue;

    const camposValidos = ['nombre', 'categoria', 'ingredientes', 'descripcion', 'precio', 'codigo'];
    if (!camposValidos.includes(searchKey)) {
      return messageGeneral(res, 400, false, "", "Campo a buscar no válido.");
    }

    if ('codigo' in actualizaciones) {
      return messageGeneral(res, 400, false, "", "El campo código no puede ser actualizado.");
    }

    // Ingresas el valor del key a un switch para determinar la validación a ejecutar.
    let validationKey;
    switch (searchKey) {
      case 'nombre':
        validationKey = valNombre;
        searchValue = new RegExp(value, 'i');
        break;
      case 'categoria':
        validationKey = valCategoria;
        searchValue = new RegExp(value, 'i');
        break;
      case 'ingredientes':
        validationKey = valIngredientes;
        searchValue = new RegExp(value, 'i');
        break;
      case 'descripcion':
        validationKey = valDescripcion;
        searchValue = new RegExp(value, 'i');
        break;
      case 'codigo':
        if (!valCodigo.test(value)) {
            return messageGeneral(res, 400, false, "", "El valor ingresado para código no es válido. Debe ser un número entero positivo.");
          }
        searchValue = parseInt(value);
        break;
      case 'precio':
         validationKey = valPrecio;
         if (!/^\d+$/.test(value)) {
           return messageGeneral(res, 400, false, "", "El valor ingresado para precio no es válido. Debe ser un número entero positivo.");
         }
        searchValue = parseInt(value, 10);
        break;
      default:
        return messageGeneral(res, 400, false, "", "Campo a actualizar no válido");
    }

    // Validar los campos que se están actualizando
    for (const field in actualizaciones) {
      if (actualizaciones.hasOwnProperty(field)) {
        let validation;
        switch (field) {
          case 'nombre':
            validation = valNombre;
            break;
          case 'categoria':
            validation = valCategoria;
            break;
          case 'ingredientes':
            validation = valIngredientes;
            break;
          case 'descripcion':
            validation = valDescripcion;
            break;
            case 'precio':
              if (!/^\d+$/.test(actualizaciones[field])) {
                return messageGeneral(res, 400, false, "", `El formato ingresado para ${field} es inválido. Debe ser un número entero.`);
              }
              actualizaciones[field] = parseInt(actualizaciones[field], 10);
              continue;            
          default:
            return messageGeneral(res, 400, false, "", `Campo ${field} no válido para actualizar.`);
        }

        if (!validation.test(actualizaciones[field])) {
          return messageGeneral(res, 400, false, "", `El formato ingresado para ${field} es inválido.`);
        }
      }
    }

    const existingRecords = await comidaModel.find({ [searchKey]: searchValue });
    if (existingRecords.length === 0) {
      return messageGeneral(res, 404, false, "", "Platillo no encontrado");
    }

    const resp = await comidaModel.updateMany({ [searchKey]: searchValue }, actualizaciones);

    if (resp.nModified === 0) {
      return messageGeneral(res, 404, false, "", "Platillo no encontrado");
    }

    messageGeneral(res, 200, true, "", "Platillos actualizados!!!");
  } catch (error) {
    messageGeneral(res, 500, false, "", error.message);
  }
};



comidaCtrl.deleteComida = async (req, res) => {
  try {
    const { key, value } = req.params;
    const keyM = key.toLowerCase();
    const query = {};

    switch (keyM) {
      case 'nombre':
        query[keyM] = new RegExp(value, 'i');
        break;
      case 'categoria':
        query[keyM] = new RegExp(value, 'i');
        break;
      case 'ingredientes':
        query[keyM] = new RegExp(value, 'i');
        break;
      case 'descripcion':
        query[keyM] = new RegExp(value, 'i');
        break;
      case 'precio':
        if (!/^\d+$/.test(value)) {
          return messageGeneral(res, 400, false, "", "El valor ingresado para precio no es válido. Debe ser un número entero positivo.");
        }
        const parsedPrecio = parseInt(value, 10);
        query[keyM] = parsedPrecio;
        break; 
      case 'codigo':
        const parsedCodigo = parseInt(value);
        if (isNaN(parsedCodigo)) {
          return messageGeneral(res, 400, false, "", "El valor ingresado para código no es válido.");
        }
        query[keyM] = parsedCodigo;
        break;
      default:
        return messageGeneral(res, 400, false, "", "Campo de búsqueda no válido.");
    }

    const resp = await comidaModel.findOneAndDelete(query);

    if (!resp) {
      return messageGeneral(res, 404, false, "", "Platillo no encontrado");
    }

    messageGeneral(res, 200, true, "", "Platillo eliminado!!!");
  } catch (error) {
    messageGeneral(res, 500, false, "", error.message);
  }
};



comidaCtrl.deleteComidaMany = async (req, res) => {
  try {
    const { key, value } = req.params;
    const searchKey = key.toLowerCase();
    let searchValue;

    switch (searchKey) {
      case 'nombre':
        searchValue = new RegExp(value, 'i');
        break;
      case 'categoria':
        searchValue = new RegExp(value, 'i');
        break;
      case 'ingredientes':
        searchValue = new RegExp(value, 'i');
        break;
      case 'descripcion':
        searchValue = new RegExp(value, 'i');
        break;
      case 'precio':
        if (!/^\d+$/.test(value)) {
          return messageGeneral(res, 400, false, "", "El valor ingresado para precio no es válido. Debe ser un número entero positivo.");
        }
        searchValue = parseInt(value, 10);
        break;        
      case 'codigo':
        const parsedCodigo = parseInt(value);
        if (isNaN(parsedCodigo)) {
          return messageGeneral(res, 400, false, "", "El valor ingresado para código no es válido.");
        }
        searchValue = parsedCodigo;
        break;
      default:
        return messageGeneral(res, 400, false, "", "Campo de búsqueda no válido.");
    }

    const resp = await comidaModel.deleteMany({ [searchKey]: searchValue });

    if (resp.deletedCount === 0) {
      return messageGeneral(res, 404, false, "", "Platillo no encontrado");
    }

    messageGeneral(res, 200, true, "", "Platillos eliminados!!!");
  } catch (error) {
    messageGeneral(res, 500, false, "", error.message);
  }
};


export default comidaCtrl;