var _ = require('lodash');

module.exports = function (trainingData) {
	var relations = {};

	_.pluck(trainingData.data, 'tags')
		.forEach(function (tags) {
			tags.forEach(function (tagA) {
				if (!relations[tagA]) {
					relations[tagA] = [];
				}
				tags.forEach(function(tagB) {
					if (tagB === tagA) {
						return;
					}
					relations[tagA].push(tagB);
				});
			});
		});

	Object.keys(relations).forEach(function (key) {
		var total = relations[key].length;
		relations[key] = _(relations[key])
			.countBy()
			.map(function (count, tag) {
				return {
					label: tag,
					value: count / total
				};
			})
			.value();
	});

	return {
		getAssociations: function (tags) {
			var candidates = [];
			tags.forEach(function (tag) {
				if (!relations[tag]) {
					return;
				}
				candidates = candidates.concat(relations[tag]);
			});

			var combined = {};

			candidates.forEach(function (candidate) {
				if (_.contains(tags, candidate.label)) {
					return;
				}
				if (!combined[candidate.label]) {
					combined[candidate.label] = 0;
				}
				combined[candidate.label] += candidate.value;
			});

			var totalChance = _(combined).sum();
			console.log(totalChance);
			var result = [];
			Object.keys(combined).forEach(function (key) {
				result.push({
					label: key,
					value: combined[key] / totalChance
				});
			});

			return _.sortBy(result, function (candidate) {
				return -candidate.value;
			});
		}
	};
};
