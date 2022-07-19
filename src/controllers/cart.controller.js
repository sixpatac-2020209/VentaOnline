' use strict '

const { validateData, checkUpdate, findShoppingCart } = require('../utils/validate');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

exports.testCart = (req, res) => {
    return res.send({ message: 'La funcion testCart esta corriendo' });
}

// ------------Guardar al carrito 
exports.saveShoppingCar = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            product: params.product
        };
        const msg = validateData(data);
        if (!msg) {
            const shoppingCart = new Cart(data);
            await shoppingCart.save();
            return res.send({ message: 'producto guardado' });
        } else return res.status(400).send(msg);
    } catch (err) {
        console.log(err);
        return err;
    }
}

// ------------------Actualizar el carrito
exports.updateShoppingCar = async (req, res) => {
    try {
        const params = req.body;
        const shoppingId = req.params.id;
        const check = await checkUpdate(params);
        if (check === false) return res.status(400).send({ message: 'Data not received' });
        const updateShoppingCar = await ShoppingCar.findOneAndUpdate({ _id: shoppingId }, params, { new: true });
        return res.send({ message: 'Updated ShoppingCart', updateShoppingCar });
    } catch (err) {
        console.log(err);
        return err;
    }
}

// ------------------Borrar el carrito
exports.deleteShopping = async (req, res) => {
    try {
        const shoppingId = req.params.id;
        const shoppingDeleted = await ShoppingCar.findOneAndDelete({ _id: shoppingId });
        if (!shoppingDeleted) return res.status(500).send({ message: 'ShoppingCar not found or already deleted' });
        return res.send({ shoppingDeleted, message: 'Account deleted' });
    } catch (err) {
        console.log(err);
        return err;
    }
}

// ------------------Añadir al carrito
exports.addToShoppCart = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub;
        const data = {
            product: params.product,
            quantity: params.quantity
        };
        const msg = validateData(data);
        if (!msg) {
            const findProduct = await Product.findOne({ _id: data.product })
            if (data.quantity >= findProduct.stock) {
                return res.send({ message: 'this quantity is not in stock' });
            } else {
                const checkShoppCart = await findShoppingCart(userId);
                if (!checkShoppCart) {
                    data.user = userId;
                    data.subtotal = (findProduct.price * data.quantity);
                    data.total = (data.subtotal);
                    const shoppingCart = new Cart(data);
                    await shoppingCart.save();
                    console.log(shoppingCart)
                    const cartId = await Cart.findOne({ user: userId })
                    const pushCart = await Cart.findOneAndUpdate({ _id: cartId._id },
                        { $push: { products: data } }, { new: true })
                        .populate('product').lean();
                    return res.send({ message: 'added to shopping cart', pushCart });
                } else {
                    const cartId = Cart.findOne({ user: userId });
                    const pushCart = await Cart.findOneAndUpdate({ _id: cartId._id },
                        { $push: { products: data } }, { new: true })
                        .populate('product').lean();

                    return res.send({ message: 'added to shopping cart', pushCart });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}