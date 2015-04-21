var mongoose = require("mongoose");
var app = require('express')();
var _ = require('lodash');

var classifier = require('./lib/classifier');
var associater = require('./lib/associater');

var mongoURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017";
mongoose.connect(mongoURI);

var QuestionModel = mongoose.model('Questions', new mongoose.Schema({
	body: {
		type: String, trim: true, required: true
	},
	tags: [
		{type: String, trim: true}
	]
}));

app.set('port', process.env.PORT || 3000);
app.use(require('body-parser').json());

app.get('/', function (req, res) {
	res.sendfile('public/index.html');
});

app.get('/script.js', function (req, res) {
	res.sendfile('public/script.js');
});

app.get('/tags', function (req, res) {
	QuestionModel.find({}).exec(function (err, result) {
		if (err) {
			res.send({data:[]});
		}
		var trainingData = result.map(function (q) {
			return {
				question: q.body,
				tags: q.tags
			};
		});

		function finish(data) {
			res.send({
				data: data
			});
		}

		var text = req.query.text;
		if (text) {
			return finish(classifier({
				data: trainingData
			}).getClassifications(text));
		}

		var tags = req.query.tags;
		if (tags) {
			return finish(associater({
				data: trainingData
			}).getAssociations(tags));
		}

		finish(
			_(trainingData)
				.pluck('tags')
				.flatten()
				.uniq()
				.map(function (tag) {
					return {
						label: tag
					};
				})
				.value()
		);
	});
});

app.get('/questions', function(req, res) {
	QuestionModel.find({}).exec(function (err, result) {
		res.send({
			questions: result
		});
	});
});

app.post('/questions', function (req, res) {
	var q = new QuestionModel({
		body: req.body.question,
		tags: req.body.tags
	});

	q.save(function (err) {
		res.send({
			status: err ? "error" : "saved"
		});
	});
});

app.post('/clear', function (req, res) {
	QuestionModel.remove({}, function(err) {
		res.send({
			status: err ? "error" : "cleared"
		});
	});
});

app.listen(app.get('port'));

