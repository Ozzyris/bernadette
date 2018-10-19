var mongoose = require('mongoose')
	mongoose.Promise = require('bluebird'),
	config = require('../config');

var url = config.database,
	db = mongoose.createConnection(url);

	db.on('error', console.error.bind(console, 'Mongoose error:'));
	db.on('connecting', function () {console.log('Mongoose connecting')});
	db.on('connected', function () {console.log('Mongoose connected')});
	db.on('open', function () {console.log('Mongoose open')});

module.exports={
    mongoose,
    "DB":db,
    "Schema" : mongoose.Schema
}