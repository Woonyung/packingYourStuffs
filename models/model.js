var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define your schome
var TripSchema = new Schema({
	stuffToPack: {},
	slug: String // will always be in format of this-is-the-slug
});

// export model for use in other files
module.exports = mongoose.model('Trip',TripSchema);