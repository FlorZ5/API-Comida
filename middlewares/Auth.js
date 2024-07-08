import jwt from 'jsonwebtoken';
import message from '../utils/messages.js';

const { messageGeneral } = message;

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ messageGeneral: 'Acceso denegado. No se ha proporcionado ningún token.' });
  }

  const token = authHeader.split(" ")[1]; //Separa el Bearer del token y toma la primera posición.

  // Verificar si hay token
  if (!token) {
    return res.status(401).json({ messageGeneral: 'Acceso denegado. No hay token válido.' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, 'secreta'); // Verifica el token con la misma clave secreta usada para firmarlo

    // Agregar el usuario desde el token verificado
    req.user = decoded;
    next(); // Continuar con la ejecución de la ruta protegida
  } catch (error) {
    res.status(401).json({ messageGeneral: 'Token no válido.' });
  }
};
