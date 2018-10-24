const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser');

// HELPERS
const particle_helper = require('../helpers/particle');

//MODEL
const particle = require('../models/particle').particle;

// MIDDLEWARE
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

	router.get('/get_last_value', function (req, res) {
		var device_id;

		particle_helper.get_device_details()
			.then( device_details => {
				device_id = device_details[0].id;
				return particle_helper.get_device_attributes( device_id );
			})
			.then( device_attributes => {
				let variable_name;

				for (var key in device_attributes) {
					if (device_attributes.hasOwnProperty(key)) {
					    variable_name = key;
					}
				}
				return particle_helper.get_variable_detail( device_id, variable_name );
			})
			.then( variable => {

				res.status(200).json( {
					'variable': variable.result,
					'date': variable.coreInfo.last_heard
				});
			})
	});

	router.get('/get_last_hour', function (req, res) {
		particle.get_last_hour()
			.then( infos => {
				res.status(200).json( infos );
			})
	});

module.exports = {
	"public" : router
};