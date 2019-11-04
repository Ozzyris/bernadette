var mongoose = require("./mongoose"),
    moment = require('moment');

var particle = new mongoose.Schema({
    values: [
        {
            name: {type: String},
            data: {type: String},

        },
    ],
    published_at: {type: Date}

}, {collection: 'particle'});

particle.statics.get_last_hour = function(){
    return new Promise((resolve, reject) => {
        this.find({ published_at : { $gt: moment().subtract(1, 'h'), $lt: moment()} }).exec()
            .then(infos => {
                console.log(infos);
                if( infos ){
                    resolve( infos );
                }else{
                    reject({ message: 'An error happend', code: 'error_happend'});
                }
            })
    })
};

var particle = mongoose.DB.model('particle', particle);

module.exports.particle = particle