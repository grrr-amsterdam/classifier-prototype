var chosenTagList = document.querySelector('ul');
var form = document.querySelector('form');
var tagInput = document.querySelector('input');
var textarea = document.querySelector('textarea');

function showPossibleTags(tags) {
	var possibleTagList = document.querySelector('ol');
	while (possibleTagList.firstChild) {
		possibleTagList.removeChild(possibleTagList.firstChild);
	}

	tags.forEach(function (tag) {
		var li = document.createElement('li');
		li.innerHTML = tag.label + " (" + tag.value + ")";
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

function postAndReadJSON(url, data, callback) {
	var request = new XMLHttpRequest();
	request.open('POST', url, true);
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	request.onload = function() {
		if (this.status >= 200 && this.status < 400) {
			callback(JSON.parse(this.response));
		}
	};

	request.send(JSON.stringify(data));
}

textarea.addEventListener('keyup', function () {
	postAndReadJSON('/getTags', {question: textarea.value}, function (result) {
		showPossibleTags(result.data);
	});
});

form.addEventListener('submit', function (e) {
	e.preventDefault();
	var tags = getAddedTags();
	var question = textarea.value;
	console.log(tags);
	console.log(question);
	if (!tags.length || !question) {
		return;
	}
	postAndReadJSON('/questions', {
		question: question,
		tags: getAddedTags()
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

