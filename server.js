const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const dotenv = require('dotenv').config();
//const router = express.Router([options]);

app.use('/', express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 9090);

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/cats`).then(() => {
	console.log('Connected?');
	const server = app.listen(process.env.APP_PORT, function() {
	  console.log('Express server listening on port ' + process.env.APP_PORT);
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