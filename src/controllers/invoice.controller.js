' use strict '

const { validateData, checkUpdate, findShoppingCart } = require('../utils/validate');
const Invoice = require('../models/invoice.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// testear conección
exports.testInvoice = (req, res) => {
    return res.send({ message: 'La funcion testInvoice esta corriendo' });
}

// revisar y guardar fatura
exports.checkInvoice = async (req, res) => {
    try {
        const userId = req.user.sub;
        const findShoppingCart = await Cart.findOne({ user: userId }).populate('product').lean();
        if (findShoppingCart === null) {
            return res.send({ message: 'There are no items in the cart' })
        } else {
            for (let index = 0; index < findShoppingCart.product.length; index++) {
                const shoppingCartProduct = await findShoppingCart.product[index];
                const indexProduct = await findShoppingCart.product[index].product.valueOf();
                const productId = await Product.findOne({ _id: indexProduct }).lean();
                let quantity = shoppingCartProduct.quantity;
                const data = {
                    stock: productId.stock,
                    sales: productId.sales
                }
                data.stock = (productId.stock - quantity);
                data.sales = (productId.sales + quantity)
                await Product.findOneAndUpdate({ _id: indexProduct }, data, { new: true }).lean()
            }
            const invoice = new Invoice(findShoppingCart);
            await invoice.save();
            await Cart.findOneAndRemove({ user: userId });
            return res.send({ message: 'Generated invoice', invoice });
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

// Actualizar factura
exports.updateInvoice = async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const params = req.body;
        const notUpdated = await checkUpdate(params);
        if (notUpdated === false) return res.status(400).send({ message: 'This params can only update by ADMIN, your not ADMIN' });
        else {
            const already = await searchUser(params.username);
            if (!already) {
                const invoiceUpdate = await Bill.findOneAndUpdate({ _id: invoiceId }, params, { new: true })
                    .lean()
                return res.send({ invoiceUpdate, message: 'Bill updated' });
            }
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}
