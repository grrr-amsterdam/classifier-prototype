var _ = require('lodash');

var classifier = require('./lib/classifier');
var associater = require('./lib/associater');

module.exports = function (trainingData) {

	if (!trainingData || !Array.isArray(trainingData)) {
		throw new Error('The provided training data should be an array.');
	}

	var trainedClassifier = classifier({
		data: trainingData
	});
	var trainedAssociater = associater({
		data: trainingData
	});

	return {
		getTagsForText: function (text) {
			return trainedClassifier.getClassifications(text);
		},

		getTagsForTags: function (tags) {
			return trainedAssociater.getAssociations(tags);
		},

		getTagsByPopularity: function (callback) {
			return _(trainingData)
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
				.value();
		}
	};
};
