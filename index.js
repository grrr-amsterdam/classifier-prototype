var mongoose = require("mongoose");
var app = require('express')();

var classifier = require('./lib/classifier');

var mongoURI = process.env.MONGOLAB_URI;

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

app.post('/getTags', function (req, res) {
	QuestionModel.find({}).exec(function (err, result) {
		if (err) {
			res.send({data:[]});
		}
		var trainingData = {
			data: result.map(function (q) {
				return {
					question: q.body,
					tags: q.tags
				};
			})
		};
		res.send({
			data: classifier(trainingData).getClassifications(req.body.question)
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

app.post('/clear', function (req, res) {
	QuestionModel.remove({}, function(err) {
		res.send({
			status: err ? "error" : "cleared"
		});
	});
});

app.listen(app.get('port'));

