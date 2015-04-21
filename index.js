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
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

function getTrainingData(callback) {
	QuestionModel.find({}).exec(function (err, result) {
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


app.get('/', function (req, res) {
	res.sendfile('public/index.html');
});

app.get('/script.js', function (req, res) {
	res.sendfile('public/script.js');
});

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

