import { Router } from "express";   
import ProductManager from "../managerProducts/manager.js";
import { __dirname } from "../path.js";
const productManager  = new ProductManager(__dirname,'../data/products.json')

const router = Router();

router.get ('/', async (req, res) => {
    res.render('home')
});


router.get('/realtimeproducts',(req, res) => { 
    res.render('realTimeProducts')
});





export default router;