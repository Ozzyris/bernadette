const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  // particle = require('particle-api-js'),
	  config = require('../config');

// MIDDLEWARE
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

	router.get('/test', function (req, res) {
		var Particle = require('particle-api-js');
		var particle = new Particle();

		var devicesPr = particle.listDevices({ auth: config.particle.token });

		devicesPr.then(
			function(devices){
				// res.status(200).json( devices );
			},
			function(err) {
				console.log('List devices call failed: ', err);
			}
		);

		var devicesPr = particle.getDevice({ deviceId: '3e0036001347343339383037', auth: config.particle.token });

		devicesPr.then(
			function(data){
				res.status(200).json( data );
			},
			function(err) {
				console.log('API call failed: ', err);
			}
		);

	});

module.exports = {
	"public" : router
};