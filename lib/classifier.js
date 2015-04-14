var natural = require('natural');
var classifier = new natural.BayesClassifier(
		require('./stemmer_nl')()
	);

JSON
	.parse(
		require('fs').readFileSync('training.json', 'utf8')
	)
	.data
	.forEach(function (taggedQuestion) {
		var question = taggedQuestion.question;
		taggedQuestion.tags.forEach(function (tag) {
			classifier.addDocument(question, tag);
		});
	});
classifier.train();

module.exports = classifier;
