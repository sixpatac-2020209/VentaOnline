'use strict'

const invoiceController = require('../controllers/invoice.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/testInvoice', invoiceController.testInvoice);
api.post('/checkInvoice/:id',mdAuth.ensureAuth,invoiceController.checkInvoice);
api.put('/updateInvoice/:id', mdAuth.ensureAuth,invoiceController.updateInvoice);

module.exports = api;