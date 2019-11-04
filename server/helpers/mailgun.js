var mailgun = require('mailgun-js'),
    Promise = require('bluebird'),
    config = require('../config');

const mailgun_master = mailgun({apiKey: config.mailgun.api_key, domain: config.mailgun.domain});

function send_email(template, email_data ){
	return new Promise((resolve, reject)=>{
		const data = {
			from: 'Bernadette <hello@sbernadette.com>',
			to: email_data.email,
			subject: email_data.subject,
			template: template,
			'h:X-Mailgun-Variables': email_data.email_variables,
		};
		mailgun_master.messages().send(data, function (error, body) {
			resolve( body );
		});
	});
	
}

module.exports={
    'send_email': send_email
};