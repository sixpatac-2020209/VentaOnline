'use strict'
const express = require('express');
const categoryController = require('../controllers/category.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/testCategory', categoryController.testCategory);
api.post('/saveCategory', [mdAuth.ensureAuth, mdAuth.isAdmin], categoryController.saveCategory);
api.get('/getCategorys', categoryController.getCategorys);
api.delete('/deleteCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], categoryController.deleteCategory);
api.put('/updateCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], categoryController.updateCategory);

module.exports = api;