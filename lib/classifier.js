var natural = require('natural');
var stemmer = require('./stemmer_nl')();

module.exports = function (trainingData) {
	var classifier = new natural.BayesClassifier(stemmer);
	trainingData
		.data
		.forEach(function (taggedText) {
			var text = taggedText.text;
			taggedText.tags.forEach(function (tag) {
				classifier.addDocument(text, tag);
			});
		});
	classifier.train();
	return classifier;
};
