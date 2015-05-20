var assert = require('assert');
var classifier = require('..');

var trainingData = [
	{
		text: "max is a big dog",
		tags: [
			"dogs",
			"labradors",
			"pets"
		]
	},
	{
		text: "bella is a small dog",
		tags: [
			"dogs",
			"corgies",
			"pets"
		]
	},
	{
		text: "lucy eats mice",
		tags: [
			"cats",
			"mice",
			"pets"
		]
	}
];

describe('initializing', function () {
	it('should fail without trainingData', function () {
		assert.throws(function () {
			classifier();
		});
	});

	it('should load the training data', function () {
		classifier(trainingData);
	});
});


describe('classifier', function () {
	var trainedClassifier;
	beforeEach(function () {
		trainedClassifier = classifier(trainingData);
	});

	it('should associate tags', function () {
		assert.equal(
			trainedClassifier.getTagsForTags(['dogs', 'labradors'])[0].label,
			"pets"
		);
	});

	it('should not associate unknown tags', function () {
		assert.equal(
			trainedClassifier.getTagsForTags(['lions']).length,
			0
		);
	});

	it('should classify text', function () {
		assert.equal(
			trainedClassifier.getTagsForText('big dog')[0].label,
			"labradors"
		);
	});

	it('should rank tags', function () {
		assert.equal(
			trainedClassifier.getTagsByPopularity()[0].label,
			"pets"
		);
	});
});
