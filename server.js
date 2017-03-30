const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const dotenv = require('dotenv').config();
//const router = express.Router([options]);

app.use('/', express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 9090);

mongoose.connect({
	host: process.env.DB_HOST,
	username: process.env.DB_USER,
	password: process.env.DB_PASS
}).then(() => {
	console.log('Connected?');
	var server = app.listen(app.get('port'), function() {
	  console.log('Express server listening on port ' + server.address().port);
	});

	const Schema = mongoose.Schema;

	const catSchema = new Schema({
		name: String,
		age: Number,
		gender: {
			type: String,
			enum: ['male', 'female']
		},
		color: String,
		weight: Number,
		dob: {
			type: Date,
			default: Date.now
		}
	});

	const Cat = mongoose.model('Cat', catSchema);

	Cat.create({ hidden: false }).then(cat => { console.log('cat id: ', cat.id); });

	let chris = new Cat({
	  name: 'Chris',
		age: 12,
	  gender: 'male',
	  color: 'black',
	  weight: 12
	});
	/*
	chris.save(function(err) {
	  if (err) throw err;

	  console.log('User saved successfully!');
	});
	*/

}, err => {
	console.log('Connection failed ', err);
});