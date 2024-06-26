import {Router} from "express";
const route = Router();
import comidaCtrl from "../controllers/comida.controller.js";

route.post('/', comidaCtrl.createComida);
route.get('/', comidaCtrl.listAllComida);
route.get('/:key/:value', comidaCtrl.searchComida);
route.put('/update/:id', comidaCtrl.update);
route.put('/:key/:value', comidaCtrl.updateComida);
route.put('/many/:key/:value', comidaCtrl.updateComidaMany);
route.delete('/delete/:id', comidaCtrl.deleteComida);


export default route;