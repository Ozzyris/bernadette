const config = require('../config'),
	  particle_model = require('../models/particle').particle;

//GLOBALE VARIABLE 
var Particle = require('particle-api-js');
var particle = new Particle();



function get_device_details(){
	return new Promise((resolve, reject)=>{
		let devicesPr = particle.listDevices({ auth: config.particle.token });
	
		devicesPr.then(function( devices ){
			resolve( devices.body );
		},
		function(err) {
			console.log('List devices call failed: ', err);
		});
	})
}

function get_device_attributes( device_id ){
	return new Promise((resolve, reject)=>{
		let devicesPr = particle.getDevice({ deviceId: device_id, auth: config.particle.token });
		devicesPr.then(function( device_details ){
				resolve( device_details.body.variables );
			},
			function(err) {
				console.log('API call failed: ', err);
			}
		);
	})
}

function get_variable_detail( device_id, variable_name ){
	return new Promise((resolve, reject)=>{
		particle.getVariable({ deviceId: device_id, name: variable_name, auth: config.particle.token })
			.then(function(data) {
				resolve( data.body );
			}, function(err) {
				console.log('An error occurred while getting attrs:', err);
			});
	})
}

function stream_device_events( device_id ){
	return new Promise((resolve, reject)=>{
		particle.getEventStream({ deviceId: device_id, auth: config.particle.token })
			.then(function(stream) {
				stream.on('event', function(data) {

			  		if( data.name == 'published_data' ){
			  			let variables = JSON.parse( data.data );
			  			let particle_details = {
			  				published_at: data.published_at,
			  				values: []
				  		}

						for (var key in variables) {
						    if (variables.hasOwnProperty( key )) {
						        let variable = {
						        	name: key,
						        	data: variables[key]
						        }

						        particle_details.values.push( variable );
						    }
						}

						console.log( particle_details );
						return new particle_model( particle_details ).save();
			  		}
				});
			});
	})
}

module.exports={
    'get_device_details': get_device_details,
    'get_device_attributes': get_device_attributes,
    'get_variable_detail': get_variable_detail,
    'stream_device_events': stream_device_events
}