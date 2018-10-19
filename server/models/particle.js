var mongoose = require("./mongoose"),
    moment = require('moment');

var particle = new mongoose.Schema({
    values: [
        {
            name: {type: String},
            data: {type: String},

        },
    ],
    published_at: {type: Date, default: moment()}

}, {collection: 'particle'});


// particle.statics.add_particle_set = function( id ){
//     return new Promise((resolve, reject) => {
//         this.findOne({ _id : id }).exec()
//             .then(players => {
//                 if( players ){
//                     resolve( players );
//                 }else{
//                     reject({ message: 'An error happend', code: 'error_happend'});
//                 }
//             })
//     })
// };

var particle = mongoose.DB.model('particle', particle);

module.exports.particle = particle