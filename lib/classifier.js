var natural = require('natural');
var stemmer = require('./stemmer_nl')();

module.exports = function (trainingData) {
	var classifier = new natural.BayesClassifier(stemmer);
	trainingData
		.data
		.forEach(function (taggedQuestion) {
			var question = taggedQuestion.question;
			taggedQuestion.tags.forEach(function (tag) {
				classifier.addDocument(question, tag);
			});
		});
	classifier.train();
	return classifier;
};
