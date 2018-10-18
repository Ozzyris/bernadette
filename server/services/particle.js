// HELPERS
const particle = require('../helpers/particle');

function init(){
	start_particle_stream();
}


function start_particle_stream(){
	particle.get_device_details()
		.then( device_details => {
			return particle.stream_device_events( device_details[0].id );
		})
}

function save_event_information( event ){
	console.log(event);
}



module.exports={
    'init': init,
    'save_event_information': save_event_information
}