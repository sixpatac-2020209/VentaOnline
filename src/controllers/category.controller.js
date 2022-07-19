'use strict '

const { findOneAndUpdate } = require('../models/category.model');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const { validateData, checkUpdate, searchCategoryId } = require('../utils/validate');

exports.testCategory = (req, res) => {
    return res.send({ message: 'La funcion de testCategory está corriendo' });

}

// ------------------- Guardar categoria
exports.saveCategory = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name,
            description: params.description,
        };
        const msg = validateData(data);
        if (!msg) {
            const category = new Category(data);
            await category.save();
            return res.send({ message: 'categoria guardada' });
        } else return res.status(400).send(msg);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.getCategorys = async (req, res) => {
    try {
        const categorys = await Category.find();
        return res.send({ categorys });
    } catch (err) {
        console.log(err);
        return err;
    }
}

// --------------Update Category
exports.updateCategory = async (req, res) => {
    try {
        const params = req.body;
        const categoryId = req.params.id;
        const check = await checkUpdate(params);
        if (check === false) return res.status(400).send({ message: 'Data not received' });
        const updateCategory = await Category.findOneAndUpdate({ _id: categoryId }, params, { new: true });
        return res.send({ message: 'Updated Category', updateCategory });
    } catch (err) {
        console.log(err);
        return err;
    }
}

//-------------------Eliminar categoria y que pase a default
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryExist = await searchCategoryId(categoryId);
        if (!categoryExist)
            return res.status(500).send({ message: 'Category not found or already delete' });
        if (categoryExist.name === 'DEFAULT')
            return res.send({ message: 'Default category cannot be deleted.' });
        const newCate = await Category.findOne({ name: 'DEFAULT' }).lean();
        const products = await Product.find({ category: categoryId });
        for (let arreglo of products) {
            const updateNewCategory = await Product.findOneAndUpdate({ _id: arreglo._id }, { category: newCate._id });
        }
        const categDeleted = await Category.findOneAndDelete({ _id: categoryId });
        return res.send({ message: 'Delete Category.', categDeleted });
    }
    catch (err) {
        console.log(err);
        return err;
    }
}
