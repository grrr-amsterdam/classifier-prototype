var mongoose = require("mongoose");
var express = require('express');
var _ = require('lodash');

var classifier = require('./lib/classifier');
var associater = require('./lib/associater');

var app = express();

var mongoURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017";
mongoose.connect(mongoURI);

var QuestionModel = mongoose.model('Questions', new mongoose.Schema({
	body: {
		type: String, trim: true, required: true
	},
	tags: [
		{type: String, trim: true}
	],
	emotion: {
		type: String, trim: true
	},
	validated: {
		type: Boolean
	}
}));

app.set('port', process.env.PORT || 3002);
app.use(require('body-parser').json());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

function getTrainingData(callback) {
	QuestionModel.find({validated: true}).exec(function (err, result) {
		if (err) {
			callback(err);
		}
		callback(null,
			result.map(function (q) {
				return {
					question: q.body,
					tags: q.tags
				};
			})
		);
	});
}

var trainedClassifier;
function retrainClassifier(callback) {
	getTrainingData(function (err, data){
		if (err) {
			return callback(err);
		}
		trainedClassifier = classifier({
			data: data
		});
		callback(null);
	});
}

var trainedAssociater;
function retrainAssociater(callback) {
	getTrainingData(function (err, data){
		if (err) {
			return callback(err);
		}
		trainedAssociater = associater({
			data: data
		});
		callback(null);
	});
}


app.use(express.static('public'));

app.get('/tags', function (req, res) {
	var text = req.query.text;
	if (text) {
		return res.send({
			data: trainedClassifier.getClassifications(text)
		});
	}

	var tags = req.query.tags;
	if (tags) {
		return res.send({
			data: trainedAssociater.getAssociations(tags)
		});
	}

	getTrainingData(function (err, data) {
		res.send({
			data: _(data)
				.pluck('tags')
				.flatten()
				.map(function (tag) {
					return {
						label: tag
					};
				})
				.countBy('label')
				.map(function (count, label) {
					return {
						label: label,
						count: count
					};
				})
				.sortBy(function (tag) {
					return -tag.count;
				})
				.value()
		});
	});
});

app.get('/questions', function(req, res) {
	QuestionModel
		.find({})
		.sort('body')
		.exec(function (err, result) {
			res.send({
				questions: result
			});
		});
});

app.post('/questions', function (req, res) {
	var saveCallback = function (err) {
		res.send({
			status: err ? "error" : "saved"
		});
	};
	var questionData = {
		body: req.body.question,
		tags: req.body.tags,
		validated: req.body.validated || false
	};

	if (req.body.emotion) {
		questionData.emotion = req.body.emotion;
	}

	// Update in stead of create?
	if (req.body._id) {
		QuestionModel.update({
			_id: req.body._id,
		}, questionData, saveCallback);
		return;
	}

	var q = new QuestionModel(questionData);
	q.save(saveCallback);
});

app.get('/questions/:id', function(req, res) {
	QuestionModel.find({_id: req.params.id}).exec(function (err, result) {
		res.send({
			question: result[0]
		});
	});
});

app.delete('/questions/:id', function(req, res) {
	QuestionModel.find({_id: req.params.id}).remove(function (err) {
		res.send({
			status: err ? "error" : "deleted"
		});
	});
});

app.get('/retrain', function(req, res) {
	retrainClassifier(function (err) {
		if (err) {
			res.send({
				status: "error"
			});
		}
		retrainAssociater(function (err) {
			res.send({
				status: err ? "error" : "retrained"
			});
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

// Initialize AI stuff and start server
console.log("Starting");
retrainClassifier(function (err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log("Classifier trained");
	retrainAssociater(function (err) {
		if (err) {
			console.log(err);
			return;
		}
		console.log("Associater trained");
		app.listen(app.get('port'));
		console.log("Server launched");
	});
});

