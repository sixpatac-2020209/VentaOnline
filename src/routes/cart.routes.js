'use strict'
const express = require('express');
const cartController = require('../controllers/cart.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/testShoppingCart', cartController.testCart);
api.post('/addCart', mdAuth.ensureAuth, cartController.addToShoppCart);


module.exports = api;