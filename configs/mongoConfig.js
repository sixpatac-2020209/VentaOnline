'use strict'

const mongoose = require('mongoose');

exports.init = () => {
    const uriMongo = 'mongodb://127.0.0.1:27017/ventaOnline-2020209';
    mongoose.Promise = global.Promise;

    mongoose.connection.on('error', () => {
        console.log('MongoDB | COULD NOT CONNECTED MONGO DB');
        mongoose.disconnect();
    });

    mongoose.connection.on('connecting', () => {
        console.log('MongoDB -try connecting');

    });

    mongoose.connection.on('connected', () => {
        console.log('MongoDB - connected mongodb');

    });

    mongoose.connection.once('open', () => {
        console.log('MongoDB - connected to database');

    });

    mongoose.connection.on('reconnected', () => {
        console.log('Mongo db | reconnected to mongoDB')
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongo db | disconnected to mongoDB')
    });

    mongoose.connect(uriMongo, {
        maxPoolSize: 50,
        connectTimeoutMS: 2500,
        useNewUrlParser: true
    }).catch(err => console.log(err));
}
