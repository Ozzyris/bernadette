
// PACKAGES
var CronJobManager = require('cron-job-manager'),
	moment = require('moment'),
	mailgun = require('../helpers/mailgun');;

// Create cron manager;
const manager = new CronJobManager();

function genrate_cron_tab_schedule( plant_info ){
	return new Promise((resolve, reject)=>{
		let watering_date = moment().add(plant_info.water_management.water_schedule, 'days'),
			watering_month = watering_date.month() + 1,
			watering_day =  watering_date.date(),
			watering_hour = plant_info.water_management.watering_time;
	
		resolve('0 ' + watering_hour + ' ' + watering_day + ' ' + watering_month + ' *');
	})
}
function add_cron( cron_id, cron_tab_schedule ){
	return new Promise((resolve, reject)=>{
		manager.add(cron_id, cron_tab_schedule, () => {
			console.log('alex cron')
			// let email_data = {
			// 	email: 'nemokervi@yahoo.fr',
			// 	email_variables: '{"plant_name": "' + 'thyme' + '"}',
			// 	subject: 'Alert your plant' + 'thyme' + ' needs some water.'
			// }

			// mailgun.send_email('plant_watering_alert', email_data);
		});
		resolve( true );
	})
}
function update_cron( cron_id, cron_tab_schedule ){
	return new Promise((resolve, reject)=>{
		manager.update(cron_id, cron_tab_schedule)
		resolve( true );
	})
}
function start_cron( cron_id ){
	return new Promise((resolve, reject)=>{
		manager.start( cron_id );
		resolve( true );

	})
}
function stop_cron( cron_id ){
	return new Promise((resolve, reject)=>{
		manager.stop( cron_id );
		resolve( true );
	})
}
function delete_cron(){} 

function list_cron(){
	return new Promise((resolve, reject)=>{
		var cron_jobs = manager.listCrons();
		resolve( cron_jobs );
	});
} 

function check_cron( cron_id ){
	return new Promise((resolve, reject)=>{
		if ( manager.exists(cron_id) ){
			resolve( true );
		}else{
			resolve (false);
		}
	})
} 

module.exports={
	genrate_cron_tab_schedule: genrate_cron_tab_schedule,
	add_cron: add_cron,
	update_cron: update_cron,
	start_cron: start_cron,
	stop_cron: stop_cron,
	delete_cron: delete_cron,
	list_cron: list_cron,
	check_cron: check_cron,
};