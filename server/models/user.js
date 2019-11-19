var mongoose = require("./mongoose"),
	moment = require('moment'),
	Promise = require('bluebird');

var user = new mongoose.Schema({
	email: {type: String},
	given_name: {type: String},
	family_name: {type: String},
	password: {type: String},
	signup_record: {
		creation_date: {type: String, default: moment().toISOString()},        
        email_validation:{
        	is_email_verified: {type: Boolean, default: false},
            token: {type: String},
            expiration_date: {type: String},
		}
	},
	auth_record: {
	    active_auth: {
			creation_date: {type: String},
			last_modification_date: {type: String},
			expiration_date: {type: String},
			keep_session: {type: Boolean, default: false},
			token: {type: String}
		}
	},
	plants: [
		{
			creation_date: {type: String, default: moment().toISOString()},
			edit_date: {type: String, default: moment().toISOString()},
			name: {type: String},
			description: {type: String},
			date_potted: {type: String},
			illustration: {type: String},
			water_management: {
				is_cron_active: {type: Boolean, default: false},
				water_schedule: {type: Number},
				last_watered: {type: Date},
				watering_time: {type: Number}
			}
		}
	]
}, {collection: 'user'});

//COMMON
user.statics.check_email = function(email){
	return new Promise((resolve, reject) => {
		this.findOne({ email : email }).exec()
	 		.then( user => {
	 			if( !user ){
	 				resolve( true );
	 			}else{
	 				reject({ message: 'Your email already exist', code: 'email_duplicate'});
	 			}
	 		})
	})
};
user.statics.get_id_from_email = function(email){
	return new Promise((resolve, reject) => {
		this.findOne({ email : email }).exec()
			.then( user => {
				if( user ){
					resolve( user._id );
				}else{
					reject({ message: 'Your email does not exist', code: 'email_not_exist'});
				}
			})
	})
};
user.statics.get_id_from_xtoken = function( session ){
	return new Promise((resolve, reject) => {
		this.findOne({ 'auth_record.token' : session }).exec()
			.then( user => {
				if( user ){
					resolve( user._id );
				}else{
					reject({ message: 'Your email does not exist', code: 'email_not_exist'});
				}
			})
	})
};
user.statics.get_userdetail_from_id = function( id ){
	return new Promise((resolve, reject) => {
		this.findOne({ _id : id }).exec()
			.then( user => {
				if( user ){
					resolve( user )
				}else{
					reject({ message: 'Your id does not exist', code: 'id_not_exist'});
				}
			})
	});
}

//MIDDLEWARE
user.statics.get_auth_detail_from_xtoken = function( xtoken ){
	return new Promise((resolve, reject) => {
		this.findOne({ 'auth_record.active_auth.token': xtoken }).exec()
			.then( user => {
				if( user ){
					let active_session = user.auth_record.active_auth;
					resolve( active_session );
				}else{
					reject({ message: 'Your session does not exist', code: 'xtoken_not_exist'});
				}
			})
	});
}
user.statics.update_token_timestamp_from_xtoken = function( xtoken, session ){
	return new Promise((resolve, reject) => {
		user.updateOne({ 'auth_record.active_auth.token': xtoken }, {
			'auth_record.active_auth.last_modification_date': moment().toISOString(),
			'auth_record.active_auth.expiration_date': session.expiration_date,
		}).exec()
		.then(session =>{
			resolve(true);
		})
	});
}

// EMAIL VERIFICATION
user.statics.get_token_details = function( token ){
    return new Promise((resolve, reject) => {
        this.findOne({ 'signup_record.email_validation.token': token }).exec()
            .then( user => {
                if( user ){
                    let cleaned_token = {
                        token: user.signup_record.email_validation.token,
                        expiration_date: user.signup_record.email_validation.expiration_date,
                    }
                    resolve( cleaned_token );
                }else{
                    reject({ message: 'Your token does not exist', code: 'token_not_exist'});
                }
            })
    });
}
user.statics.update_email_verification_from_token = function( token ){
	return new Promise((resolve, reject) => {
		user.updateOne({ 'signup_record.email_validation.token': token }, {
			'signup_record.email_validation.is_email_verified': true
		}).exec()
		.then(session =>{
			resolve(true);
		})
	});
}

//SIGNIN
user.statics.get_signup_info_from_email = function( email ){
	return new Promise((resolve, reject) => {
		this.findOne({ email : email }).exec()
			.then( user => {
				if( user ){
					resolve( {password: user.password, is_email_verified:user.signup_record.email_validation.is_email_verified} )
				}else{
					reject({ message: 'Your email does not exist', code: 'email_not_exist'});
				}
			})
	});
}
user.statics.save_session_detail_from_id = function (session, user_id){
	return new Promise((resolve, reject) => {
		user.updateOne({ _id: user_id }, {
			auth_record: {
				active_auth: {
					creation_date: moment().toISOString(),
					last_modification_date: moment().toISOString(),
					expiration_date: session.expiration_date,
					token: session.token
				}
			}
		}).exec()
		.then(session =>{
			resolve(true);
		})
	});
}

//PLANT
user.statics.create_plant = function( user_id ){
	return new Promise((resolve, reject) => {
		user.updateOne({ _id: user_id }, {
			$push:{
				"plants": {}
			}
		}).exec()
		.then(plant_payload =>{
			resolve( plant_payload );
		})
	});
}

user.statics.get_last_plant_created_id = function( user_id ){
	return new Promise((resolve, reject) => {
		user.findOne({ _id: user_id }, {}).exec()
		.then(user =>{
			resolve( user.plants[(user.plants.length-1)]._id );
		})
	});
}

user.statics.update_plant_name = function( user_id, payload ){
	return new Promise((resolve, reject) => {
		user.updateOne({ _id: user_id, 'plants._id': payload._id }, {
			$set:{
				"plants.$.name": payload.name,
				"plants.$.edit_date": payload.edit_date
			}
		}).exec()
		.then(is_name_updated =>{
			resolve(is_name_updated);
		})
	});
}

user.statics.update_plant_description = function( user_id, payload ){
	return new Promise((resolve, reject) => {
		user.updateOne({ _id: user_id, 'plants._id': payload._id }, {
			$set:{
				"plants.$.description": payload.description,
				"plants.$.edit_date": payload.edit_date
			}
		}).exec()
		.then(is_description_updated =>{
			resolve(is_description_updated);
		})
	});
}

user.statics.update_plant_date_potted = function( user_id, payload ){
	return new Promise((resolve, reject) => {
		user.updateOne({ _id: user_id, 'plants._id': payload._id }, {
			$set:{
				"plants.$.date_potted": payload.date_potted,
				"plants.$.edit_date": payload.edit_date
			}
		}).exec()
		.then(is_date_potted_updated =>{
			resolve(is_date_potted_updated);
		})
	});
}

user.statics.update_plant_watering_time = function( user_id, payload ){
	return new Promise((resolve, reject) => {
		user.updateOne({ _id: user_id, 'plants._id': payload._id }, {
			$set:{
				"plants.$.water_management.watering_time": payload.watering_time,
				"plants.$.edit_date": payload.edit_date
			}
		}).exec()
		.then(is_watering_time_updated =>{
			resolve(is_watering_time_updated);
		})
	});
}

user.statics.update_plant_last_watered = function( user_id, payload ){
	return new Promise((resolve, reject) => {
		user.updateOne({ _id: user_id, 'plants._id': payload._id }, {
			$set:{
				"plants.$.water_management.last_watered": payload.last_watered,
				"plants.$.edit_date": payload.edit_date
			}
		}).exec()
		.then(is_last_watered_updated =>{
			resolve(is_last_watered_updated);
		})
	});
}

user.statics.update_plant_water_schedule = function( user_id, payload ){
	return new Promise((resolve, reject) => {
		user.updateOne({ _id: user_id, 'plants._id': payload._id }, {
			$set:{
				"plants.$.water_management.water_schedule": payload.water_schedule,
				"plants.$.edit_date": payload.edit_date
			}
		}).exec()
		.then(is_water_schedule_updated =>{
			resolve(is_water_schedule_updated);
		})
	});
}

user.statics.update_plant_cron = function( user_id, payload ){
	return new Promise((resolve, reject) => {
		user.updateOne({ _id: user_id, 'plants._id': payload._id }, {
			$set:{
				"plants.$.water_management.is_cron_active": payload.toggle,
				"plants.$.edit_date": payload.edit_date
			}
		}).exec()
		.then(is_cron_toggle_updated =>{
			resolve(is_cron_toggle_updated);
		})
	});
}

user.statics.get_plant_info = function(  user_id, plant_id ){
	return new Promise((resolve, reject) => {

		this.find( { _id: user_id, "plants._id": plant_id }, { plants: { $elemMatch: { _id: plant_id } } } )
			.then( plant => {
				if( plant ){
					resolve( plant[0].plants[0] )
				}else{
					reject({ message: 'Your user or your plant does not exist', code: 'user_id_or_plant_id_not_exist'});
				}
			})
	});
}

var user = mongoose.DB.model('user', user);
module.exports.user = user