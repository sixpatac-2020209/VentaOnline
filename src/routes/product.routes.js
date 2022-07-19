'use strict'

const productController = require('../controllers/product.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/prueba', productController.prueba);
api.post('/saveProduct', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.saveProduct);
api.get('/getProducts', productController.getProducts);
api.get('/getProduct/:id', productController.getProduct);
api.post('/searchProduct', productController.searchProduct);
api.put('/updateProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.updateProduct);
api.delete('/deleteProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.deleteProduct);
api.get('/getStock', mdAuth.ensureAuth, productController.getstock);

api.get('/productsTired', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.productsTired);
api.get('/productsSold', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.productsSold);

module.exports = api;
