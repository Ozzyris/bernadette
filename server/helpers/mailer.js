// var nodemailer = require('nodemailer'),
//     Promise = require('bluebird'),
//     fs = require('fs'),
//     config = require('../config');

// var transporter = nodemailer.createTransport( config.email_params );

// // function send_email( subject, body ){
// // 	return new Promise((resolve, reject)=>{

// // 		//Mail Param
// // 		let mailOptions = {
// // 			from: '"Logger 🔥" <noreply@logger.com>',
// // 			to: 'nemokervi@yahoo.fr',
// // 			subject: subject,
// // 			html: body
// // 		};

// // 		transporter.sendMail(mailOptions, (error, info) => {
// // 			if( error ){
// // 				reject( error );
// // 			}else{
// // 				console.log(info);
// // 				resolve( info );
// // 			}
// // 		});
// // 	});
// // }

// // function build_email_verification(url, user_details){
// // 	return new Promise((resolve, reject)=>{
// // 		fs.readFile('templates/emails/email_verification.html', 'utf8', (err, html) => {

// // 			html = html.replace('{{Given_name}}', user_details.given_name);
// // 			html = html.replace('{{verfiy_email_link}}', url);
// // 			resolve( html );
// // 		});
// // 	});
// // }

// // function build_email_forgot_password(url, user_details){
// // 	return new Promise((resolve, reject)=>{
// // 		fs.readFile('templates/emails/forgot_password.html', 'utf8', (err, html) => {

// // 			html = html.replace('{{Given_name}}', user_details.given_name);
// // 			html = html.replace('{{forgot_password_link}}', url);
// // 			resolve( html );
// // 		});
// // 	});
// // }

// module.exports={
//     send_email: send_email,
//     'build_email_verification': build_email_verification,
//     'build_email_forgot_password': build_email_forgot_password
// };