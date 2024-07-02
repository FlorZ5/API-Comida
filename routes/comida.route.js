import {Router} from "express";
const route = Router();
import comidaCtrl from "../controllers/comida.controller.js";
<<<<<<< HEAD

route.post('/', comidaCtrl.createComida);
route.get('/', comidaCtrl.listAllComida);
route.get('/:key/:value', comidaCtrl.searchComida);
route.put('/:key/:value', comidaCtrl.updateComida);
route.put('/many/:key/:value', comidaCtrl.updateComidaMany);
route.delete('/:key/:value', comidaCtrl.deleteComida);
route.delete('/many/:key/:value', comidaCtrl.deleteComidaMany);
=======
import { authMiddleware } from '../middlewares/Auth.js';

route.post('/', authMiddleware, comidaCtrl.createComida);
route.get('/', authMiddleware, comidaCtrl.listAllComida);
route.get('/:key/:value', authMiddleware, comidaCtrl.searchComida);
route.put('/:key/:value', authMiddleware, comidaCtrl.updateComida);
route.put('/many/:key/:value', authMiddleware, comidaCtrl.updateComidaMany);
route.delete('/:key/:value', authMiddleware, comidaCtrl.deleteComida);
route.delete('/many/:key/:value', authMiddleware, comidaCtrl.deleteComidaMany);
>>>>>>> origin/JWT

export default route;