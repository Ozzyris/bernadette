const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  moment = require('moment'),
	  user_model = require('../models/user').user,
	  config = require('../config');;

// HELPERS
const bcrypt = require('../helpers/bcrypt'),
	  token_manager = require('../helpers/token_manager'),
	  mailgun = require('../helpers/mailgun');

// MIDDLEWARE
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

	router.get('/ping', function (req, res) {
		res.status(200).json({message: 'pong'});
	});

	// SIGN UP
	router.put('/signup', function (req, res) {
		let user = {
			email: req.body.email,
			given_name: req.body.given_name,
			family_name: req.body.family_name,
			password: req.body.password,
			signup_record: {
				email_validation: {
					token: token_manager.create_token(),
					expiration_date: moment().add(1,'day'),
				}
			}
		},
		email_data = {
			email: req.body.email,
			email_variables: '{"given_name": "' + req.body.given_name + '", "verfiy_email_link": "' + config.back_end_url + 'auth/email-verification/' +  user.signup_record.email_validation.token + '" }',
			subject: 'Please verify you email.'
		};

		user_model.check_email( user.email )
			.then( is_email_unique => {
				return bcrypt.hash_password( user.password );
			})
			.then( hash_password => {
				user.password = hash_password;
				new user_model(user).save();
			})
			.then( is_user_created => {
				return mailgun.send_email('verification_email', email_data);
			})
			.then( is_email_sent => {
				console.log( is_email_sent );
				res.status(200).json({message: 'New user added to the database', code: 'user_created'});
			})
			.catch( error => {
				res.status(401).json( error );
			})
	});

// SIGN IN
	router.post('/signin', function (req, res) {
		let user = {
			id: '',
			email: req.body.email,
			password: req.body.password,
		},
		session = {
			token: '',
			expiration_date: '',
			keep_session: req.body.keep_session
		};

		user_model.get_signup_info_from_email( user.email )
			.then( signup_infos => {
				if(signup_infos.is_email_verified == true ){
					return bcrypt.compare_password( user.password, signup_infos.password );
				}else{
					throw { message: 'Your email is not verified', code: 'email_unverified' };
				}
			})
			.then(are_password_similar => {
				if( are_password_similar ){
					return user_model.get_id_from_email( user.email );
				}else{
					throw { message: 'Your email or password is invalid', code: 'wrong_identifiants' };
				}
			})
			.then(user_id => {
				user.id = user_id;
				session.token = token_manager.create_token();

				if( session.keep_session == true ){
					session.expiration_date = moment().add(7,'day');
				}else{
					session.expiration_date = moment().add(1,'day');
				}

				return user_model.save_session_detail_from_id( session, user_id );
			})
			.then(is_session_saved => {
				return user_model.get_userdetail_from_id( user.id );
			})
			.then(user_details => {
				res.status(200).json({ user_id: user.id, session: session.token, given_name: user_details.given_name, family_name: user_details.family_name});
			})
			.catch( error => {
				res.status(401).json( error );
			});
	});

router.get('/email-verification/:token', function (req, res) {
	let token = req.params.token;

	user_model.get_token_details( token )
		.then( token_details => {
			console.log(token_details);
			return token_manager.check_if_token_is_valid( token_details );			
		})
		.then( is_token_valid => {
			console.log( 'auth: ' + token);
			return user_model.update_email_verification_from_token( token );
		})
		.then(is_email_verification_updated => {
			console.log( 'is_email_verification_updated: ' + is_email_verification_updated );
			res.status(200).json({ message: 'Your email has been validated', code: 'email_validated' })
		})
		.catch( error => {
			res.status(401).json( error );
		});
});


module.exports = {
	"auth" : router
};