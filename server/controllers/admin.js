const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  moment = require('moment'),
	  recipe_model = require('../models/recipe').recipe;

// MIDDLEWARE
router.use( require('../middlewares/auth').check_auth );
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

	router.get('/ping', function (req, res) {
		res.status(200).json({message: 'pong'});
	});

module.exports = {
	"admin" : router
};