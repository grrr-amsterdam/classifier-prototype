function getTagsForTextarea() {
	postAndReadJSON('/getTags', {question: textarea.value}, function (result) {
		showTags(result.data);
	});
}

function showTags(tags) {
	var tagList = document.querySelector('ol');
	while (tagList.firstChild) {
		tagList.removeChild(tagList.firstChild);
	}

	tags.forEach(function (tag) {
		var li = document.createElement('li');
		li.innerHTML = tag.label + " (" + tag.value + ")";
		tagList.appendChild(li);
	});
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
var textarea = document.querySelector('textarea');
textarea.addEventListener('keyup', getTagsForTextarea);

