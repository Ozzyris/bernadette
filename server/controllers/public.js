const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser');

// HELPERS
const particle = require('../helpers/particle');

// MIDDLEWARE
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

	router.get('/get_last_value', function (req, res) {
		var device_id;

		particle.get_device_details()
			.then( device_details => {
				device_id = device_details[0].id;
				return particle.get_device_attributes( device_id );
			})
			.then( device_attributes => {
				let variable_name;

				for (var key in device_attributes) {
					if (device_attributes.hasOwnProperty(key)) {
					    variable_name = key;
					}
				}
				return particle.get_variable_detail( device_id, variable_name );
			})
			.then( variable => {

				res.status(200).json( {
					'variable': variable.result,
					'date': variable.coreInfo.last_heard
				});
			})
	});

	router.get('/get_stream', function (req, res) {
		var device_id;

		particle.get_device_details()
			.then( device_details => {
				device_id = device_details[0].id;
				return particle.get_device_events( device_id );
			})
			.then( device_events => {
				res.status(200).json({ device_events })
			})

	});

module.exports = {
	"public" : router
};