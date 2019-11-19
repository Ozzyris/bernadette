var uuid = require('uuid/v4'),
	moment = require('moment');

function create_token(){
	return uuid();
}

function check_if_token_is_valid( token_details ){
	return new Promise((resolve, reject)=>{
		if( moment(token_details.expiration_date).isAfter() ){
			resolve( true );
		}else{
			reject({ message: 'Your token is expired, please send another verification mail', code: 'token_expired' })
		}
	})
}

module.exports={
	'create_token': create_token,
	'check_if_token_is_valid': check_if_token_is_valid,
}