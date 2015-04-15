var natural = require('natural');
var classifier = new natural.BayesClassifier(
		require('./stemmer_nl')()
	);

module.exports = function (trainingData) {
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
