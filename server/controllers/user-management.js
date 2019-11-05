const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  moment = require('moment'),
	  user_model = require('../models/user').user;

// MIDDLEWARE
router.use( require('../middlewares/auth').check_auth );
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

	router.get('/ping', function (req, res) {
		res.status(200).json({message: 'pong'});
	});

module.exports = {
	"user_management" : router
};