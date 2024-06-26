import {Router} from "express";
const route = Router();
import comidaCtrl from "../controllers/comida.controller.js";

route.post('/', comidaCtrl.createComida);
route.get('/', comidaCtrl.listAllComida);
route.get('/:key/:value', comidaCtrl.searchComida);
route.put('/:key/:value', comidaCtrl.updateComida);
route.put('/many/:key/:value', comidaCtrl.updateComidaMany);
route.delete('/:key/:value', comidaCtrl.deleteComida);
route.delete('/many/:key/:value', comidaCtrl.deleteComidaMany);

export default route;