'use strict'

const { validateData, checkUpdate, checkPermission, } = require('../utils/validate');
const Product = require('../models/product.model');

exports.prueba = (req, res) => {
    return res.send({ message: 'La funcion de prueba producto está corriendo' });

}

// -------------------Guardar producto
exports.saveProduct = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name,
            description: params.description,
            price: params.price,
            stock: params.stock,
            sales: params.sales,
            category: params.category
        };
        const msg = validateData(data);
        if (!msg) {
            const product = new Product(data);
            await product.save();
            return res.send({ message: 'Product saved' });
        } else return res.status(400).send(msg);
    } catch (err) {
        console.log(err);
        return err;
    }
}

// --------------------Obtener todos los productos
exports.getProducts = async(req,res)=>{
    try{
        const products = await Product.find()
        .populate('category')
        .lean();
        return res.send({products});
    }catch(err){
        console.log(err);
        return err;
    }
}

// -----------------Obtener un producto con su id
exports.getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findOne({ _id: productId });
        if (!product) return res.send({ message: 'Product not found :(' });
        return res.send({ product });
    } catch (err) {
        console.log(err);
        return err;
    }
}

// ------------------Buscar producto
exports.searchProduct = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name
        };
        const msg = validateData(data);
        if (!msg) {
            const product = await Product.find({ name: { $regex: params.name, $options: 'i' } });
            return res.send({ product });
        } else
            return res.status(400).send(msg);
    } catch (err) {
        console.log(err);
        return err;
    }
}

// ------------------Actualizar Producto
exports.updateProduct = async (req, res) => {
    try {
        const params = req.body;
        const productId = req.params.id;
        const check = await checkUpdate(params);
        if (check === false) return res.status(400).send({ message: 'Data not received' });
        const updateProduct = await Product.findOneAndUpdate({ _id: productId }, params, { new: true });
        return res.send({ message: 'Updated Product', updateProduct });
    } catch (err) {
        console.log(err);
        return err;
    }
}

// -----------------------Productos agotados
exports.productsTired = async (req, res) => {
    try {
        const product = await Product.find({ stock: 0 });
        if (!product) return res.send({ message: 'Sorry, product out of stock' });
        return res.send({ product });
    } catch (err) {
        console.log(err);
        return err;
    }
}

// ------------------------Productos más vendidos
exports.productsSold = async (req, res) => {
    try {
        const product = await Product.find().sort({ sales: -1 });
        if (!product) return res.send({ message: 'Most selled products' });
        return res.send({ product });
    } catch (err) {
        console.log(err);
        return err;
    }
}

// -----------------------Eliminar producto
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const productDeleted = await Product.findOneAndDelete({ _id: productId });
        if (!productDeleted) return res.status(500).send({ message: 'Product not found or already deleted' });
        return res.send({ productDeleted, message: 'Product deleted' });
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.getstock = async (req, res) =>{
    try{
        const products = await Product.find();
        if(!products) return res.send({message: 'Products not found'});
        for(let produ of products){
            produ.price = undefined; 
            produ.description = undefined; 
            produ.sales = undefined;
            produ.category = undefined;
        } 
        return res.send({message: 'Stock', products})
    }catch(err){
        console.log(err);
        return err; 
    }
}