import { UserModel } from "../models/usuario.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import messages from "../utils/messages.js";

const { messageGeneral } = messages;
const userCtrl = {};

userCtrl.register = async (req, res) => {
  try {
    const data = req.body;
    
    // Estas son las validaciones
    const valName_LastName = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,40}$/;
    const valEmail = /^[A-Za-z0-9._-]{1,25}@[A-Za-z0-9._-]{1,25}$/;
    const valPass = /^[A-Za-z0-9\/\-_\@\.]{8,30}$/;

    if (!valName_LastName.test(data.nombre)) {
      return messageGeneral(res, 400, false, "", "El formato ingresado para el nombre es inválido. Solo se permiten letras, debe contener mínimo 3 caracteres y máximo 40.");
    }
    
    if (!valName_LastName.test(data.apellido)) {
      return messageGeneral(res, 400, false, "", "El formato ingresado para el apellido es inválido. Solo se permiten letras, debe contener mínimo 3 caracteres y máximo 40.");
    }

    if (!valEmail.test(data.correo) || data.correo.length < 15 || data.correo.length > 40) {
      return messageGeneral(res, 400, false, "", "El formato ingresado para el correo es inválido. Solo se permiten letras mayúsculas y minúsculas sin acentos, números, los caracteres ._- y debe contener un símbolo de @. Mínimo 14 caracteres, máximo 40 caracteres");
    }

    if (!valPass.test(data.password)) {
      return messageGeneral(res, 400, false, "", "El formato ingresado para la contraseña es inválido. Solo puede contener letras mayúsculas o minúsculas sin acentos, números y los caracteres /-_@., sin espacios en blanco, y debe tener una longitud de 8 a 30 caracteres.");
    }

    const resp = await UserModel.findOne({ correo: data.correo });
    if (resp) {
      return messageGeneral(res, 400, false, "", "El correo ya existe.");
    }

    data.password = await bcrypt.hash(data.password, 10);
    const newUser = await UserModel.create(data);
    const token = jwt.sign({ _id: newUser._id }, "secreta");
    messageGeneral(res, 201, true, { ...newUser._doc, password: null, token }, "El usuario se creó correctamente!!!");
  } catch (error) {
    messageGeneral(res, 500, false, "", error.message);
  }
}

userCtrl.login = async (req, res) => {
  try {
    const data = req.body;

    // Validaciones
    const valEmail = /^[A-Za-z0-9._-]{1,25}@[A-Za-z0-9._-]{1,25}$/;
    const valPass = /^[A-Za-z0-9\/\-_\@\.]{8,30}$/;

    if (!valEmail.test(data.correo) || data.correo.length < 15 || data.correo.length > 40) {
      return messageGeneral(res, 400, false, "", "El formato ingresado para el correo es inválido. Solo se permiten letras mayúsculas y minúsculas sin acentos, números, los caracteres ._- y debe contener un símbolo de @. Mínimo 14 caracteres, máximo 40 caracteres");
    }

    if (!valPass.test(data.password)) {
      return messageGeneral(res, 400, false, "", "La contraseña ingresada es incorrecta.");
    }

    const resp = await UserModel.findOne({ correo: data.correo });
    if (!resp) {
      return messageGeneral(res, 400, false, "", "El correo no existe");
    }

    // Comparar la contraseña encriptada
    const match = await bcrypt.compare(data.password, resp.password);

    if (match) {
      // Generar token JWT
      const token = jwt.sign({ _id: resp._id }, 'secreta', { expiresIn: '1h' }); // Ajusta el tiempo de expiración según tus necesidades

      return messageGeneral(res, 201, true, { ...resp._doc, password: null, token }, "¡¡¡Bienvenido!!!"); // Enviar respuesta con el token y otros datos del usuario
    }

    return messageGeneral(res, 400, false, "", "La contraseña es incorrecta!!!");
  } catch (error) {
    return messageGeneral(res, 500, false, "", error.message);
  }
}
export default userCtrl;