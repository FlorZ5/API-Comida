import {Router} from "express";
const route = Router();
import comidaCtrl from "../controllers/comida.controller.js";
import { authMiddleware } from '../midlewares/Auth.js';

route.post('/', authMiddleware, comidaCtrl.createComida);
route.get('/', authMiddleware, comidaCtrl.listAllComida);
route.put('/update/:id', authMiddleware, comidaCtrl.updateComida);
route.delete('/delete/:id', authMiddleware, comidaCtrl.deleteComida);
route.get('/nombre/:nombre', authMiddleware, comidaCtrl.searchComida);
route.get('/filtros', authMiddleware, comidaCtrl.comidasWithFilters);


export default route;