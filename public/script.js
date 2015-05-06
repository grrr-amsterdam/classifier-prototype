var chosenTagList = document.querySelector('ul');
var form = document.querySelector('form');
var tagInput = document.querySelector('input.tag');
var validatedInput = document.querySelector('input.validated');
var textarea = document.querySelector('textarea');

function showPossibleTags(tags) {
	var possibleTagList = document.querySelector('ol');
	while (possibleTagList.firstChild) {
		possibleTagList.removeChild(possibleTagList.firstChild);
	}

	tags.forEach(function (tag) {
		var li = document.createElement('li');
		var label = tag.label;
		if (tag.value) {
			label += " (" + tag.value + ")";
		}
		li.innerHTML = label;
		possibleTagList.appendChild(li);
		li.addEventListener("click", function () {
			addTag(tag.label);
		});
	});
}

function getAddedTags() {
	var existingTags = Array.prototype.slice.call(chosenTagList.childNodes);
	return existingTags.map(function(existingTag) {
		return existingTag.innerHTML;
	}).filter(function (tag) {
		return tag;
	});
}

function removeTag(tag) {
	var existingTags = Array.prototype.slice.call(chosenTagList.childNodes);
	existingTags.forEach(function (existingTag) {
		if (existingTag.innerHTML !== tag) {
			return;
		}
		chosenTagList.removeChild(existingTag);
	});
}

function addTag(tag) {
	var existingTags = getAddedTags();
	var alreadyAdded = false;
	existingTags.forEach(function (existingTag) {
		if (existingTag === tag) {
			alreadyAdded = true;
		}
	});
	if (alreadyAdded) {
		return;
	}

	var li = document.createElement('li');
	li.innerHTML = tag;
	li.addEventListener("click", function () {
		removeTag(tag);
	});
	chosenTagList.appendChild(li);
}

textarea.addEventListener('keyup', function () {
	getJSON('/tags?text=' + encodeURIComponent(textarea.value), function (result) {
		showPossibleTags(result.data);
	});
});

form.addEventListener('submit', function (e) {
	e.preventDefault();
	var tags = getAddedTags();
	var question = textarea.value;
	if (!tags.length || !question) {
		return;
	}
	postJSON('/questions', {
		question: question,
		tags: getAddedTags(),
		validated: validatedInput.checked,
		_id: _id
	}, function (result) {
		location.reload();
	});
});

tagInput.addEventListener('keydown', function (e) {
	var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	if (keyCode === 13) {
		e.preventDefault();
		var tag = tagInput.value;
		addTag(tag);
		tagInput.value = "";
	}
});

getJSON('/tags', function (result) {
	showPossibleTags(result.data);
});

// If query param is set, prefill with existing question
var _id = getQueryParameterByName('_id');
if (_id) {
	getJSON('/questions/' + _id, function (data) {
		textarea.value = data.question.body;
		data.question.tags.forEach(addTag);
		validatedInput.checked = data.question.validated;
	});
}
