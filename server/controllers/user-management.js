const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  moment = require('moment'),
	  user_model = require('../models/user').user;

//HELPERS
const cron_job_manager = require('../helpers/cron-job-manager');

// MIDDLEWARE
router.use( require('../middlewares/auth').check_auth );
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

	router.get('/ping', function (req, res) {
		res.status(200).json({message: 'pong'});
	});

	function new_plant_potter( user_id, plant_id ){
		return new Promise((resolve, reject) => {
			if( plant_id == 'newplant'){
				user_model.create_plant( user_id )
					.then( plant_payload => {
						return user_model.get_last_plant_created_id( user_id );
					})
					.then( plant_id => {
						resolve(plant_id);
					})
					.catch( error => {
						reject(error);
					})
				
			}else{
				resolve(plant_id);
			}
		})
	}

	router.post('/update-plant-name', function (req, res) {
		let user_id = req.body.user_id,
			payload = {
				_id: req.body.plant_id,
				name: req.body.name,
				edit_date: moment().toISOString()
			};

			new_plant_potter( user_id, payload._id )
				.then( plant_id => {
					payload._id = plant_id;
					return user_model.update_plant_name( user_id, payload );
				})
				.then( is_name_updated => {
					res.status(200).json({message: 'The plant name has been updated', code: 'plant_name_updated', plant_id: payload._id});
				})
				.catch( error => {
					res.status(401).json( error );
				})
	});

	router.post('/update-plant-description', function (req, res) {
		let user_id = req.body.user_id,
			payload = {
				_id: req.body.plant_id,
				description: req.body.description,
				edit_date: moment().toISOString()
			};

			new_plant_potter( user_id, payload._id )
				.then( plant_id => {
					payload._id = plant_id;
					return user_model.update_plant_description( user_id, payload );
				})
				.then( is_name_updated => {
					console.log(is_name_updated);
					res.status(200).json({message: 'The plant description has been updated', code: 'plant_description_updated', plant_id: payload._id});
				})
				.catch( error => {
					res.status(401).json( error );
				})
	});

	router.post('/update-plant-date-potted', function (req, res) {
		let user_id = req.body.user_id,
			payload = {
				_id: req.body.plant_id,
				date_potted: req.body.date_potted,
				edit_date: moment().toISOString()
			};

			new_plant_potter( user_id, payload._id )
				.then( plant_id => {
					payload._id = plant_id;
					return user_model.update_plant_date_potted( user_id, payload );
				})
				.then( is_name_updated => {
					res.status(200).json({message: 'The plant date potted has been updated', code: 'plant_date_potted_updated', plant_id: payload._id});
				})
				.catch( error => {
					res.status(401).json( error );
				})
	});

	router.post('/update-plant-watering-time', function (req, res) {
		let user_id = req.body.user_id,
			payload = {
				_id: req.body.plant_id,
				watering_time: req.body.watering_time,
				edit_date: moment().toISOString()
			};


			new_plant_potter( user_id, payload._id )
				.then( plant_id => {
					payload._id = plant_id;
					return user_model.update_plant_watering_time( user_id, payload );
				})
				.then( is_name_updated => {
					res.status(200).json({message: 'The plant watering time has been updated', code: 'plant_watering_time_updated', plant_id: payload._id});
				})
				.catch( error => {
					res.status(401).json( error );
				})
	});

	router.post('/update-plant-last-watered', function (req, res) {
		let user_id = req.body.user_id,
			payload = {
				_id: req.body.plant_id,
				last_watered: req.body.last_watered,
				edit_date: moment().toISOString()
			};


			new_plant_potter( user_id, payload._id )
				.then( plant_id => {
					payload._id = plant_id;
					return user_model.update_plant_last_watered( user_id, payload );
				})
				.then( is_name_updated => {
					res.status(200).json({message: 'The plant last watered has been updated', code: 'plant_last_watered_updated', plant_id: payload._id});
				})
				.catch( error => {
					res.status(401).json( error );
				})
	});

	router.post('/update-plant-water-schedule', function (req, res) {
		let user_id = req.body.user_id,
			payload = {
				_id: req.body.plant_id,
				water_schedule: req.body.water_schedule,
				edit_date: moment().toISOString()
			};


			new_plant_potter( user_id, payload._id )
				.then( plant_id => {
					payload._id = plant_id;
					return user_model.update_plant_water_schedule( user_id, payload );
				})
				.then( is_name_updated => {
					res.status(200).json({message: 'The plant water schedule has been updated', code: 'plant_water_schedule_updated', plant_id: payload._id});
				})
				.catch( error => {
					res.status(401).json( error );
				})
	});

	router.post('/toggle-cron', function (req, res) {
		let user_id = req.body.user_id,
			payload = {
				_id: req.body.plant_id,
				toggle: req.body.toggle,
				edit_date: moment().toISOString()
			},
			cron_tab_schedule;

		if( payload.toggle == 'true' ){
			//Last watered date


			user_model.get_plant_info( user_id, payload._id )
				.then( plant_info => {
					return cron_job_manager.genrate_cron_tab_schedule(plant_info);
				})
				.then( cron_tab_schedule_l => {
					cron_tab_schedule = cron_tab_schedule_l;
					// cron_tab_schedule = '* * * * *';
					return cron_job_manager.check_cron( payload._id );
				})
				.then( is_cron_exist => {
					if(is_cron_exist == true){
						//update
						return cron_job_manager.update_cron( payload._id, cron_tab_schedule );
					}else{
						//add
						return cron_job_manager.add_cron( payload._id, cron_tab_schedule );
					}
				})
				.then( is_cron_added => {
					return cron_job_manager.start_cron( payload._id );
				})
				.then( is_cron_started => {
					return user_model.update_plant_cron( user_id, payload );
				})
				.then( is_cron_toggle_updated => {
					res.status(200).json({message: 'The plant cron has been started', code: 'plant_cron_started'});
				})
				.catch( error => {
					res.status(401).json( error );
				})

		}else{
			//stop cron
			return cron_job_manager.stop_cron()
				.then( is_cron_stopted => {
					return user_model.update_plant_cron( user_id, payload );
				})
				.then( is_cron_toggle_updated => {
					res.status(200).json({message: 'The plant cron has been stopped', code: 'plant_cron_stopped'});
				})
				.catch( error => {
					res.status(401).json( error );
				})
		}
	});

	router.get('/list-cron', function (req, res) {
		cron_job_manager.list_cron()
			.then( cron_jobs => {
				res.status(200).json( cron_jobs );
			})
			.catch( error => {
				res.status(401).json( error );
			})
	});

	router.get('/plant-info', function (req, res) {
		let user_id = req.body.user_id,
			payload = { _id: req.body.plant_id };

		user_model.get_plant_info( user_id, payload._id )
			.then( plant_info => {
				res.status(200).json(plant_info);
			})
			.catch( error => {
				res.status(401).json( error );
			})
	});

module.exports = {
	"user_management" : router
};