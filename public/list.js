var table = document.querySelector('table');

getJSON('/questions', function (questions) {
	questions.questions.forEach(function (question) {
		var tr = document.createElement('tr');
		var bodyTd = document.createElement('td');
		var tagsTd = document.createElement('td');
		var deleteTd = document.createElement('td');

		var bodyTruncated = question.body.substring(0, 50);
		var bodyHTML = '<a href="/?_id=' + question._id + '"">';
		bodyHTML += bodyTruncated;
		if (bodyTruncated.length < question.body.length) {
			bodyHTML += "&hellip;";
		}
		bodyHTML += '</a>';
		bodyTd.innerHTML = bodyHTML;

		var tagsHTML = question.tags.join(', ');
		tagsTd.innerHTML = tagsHTML;
		tagsTd.classList.add('tagColumn');

		var deleteButton = document.createElement('button');
		deleteButton.innerHTML = 'Delete';
		deleteButton.addEventListener('click', function () {
			if (!confirm('Are you sure? This can not be undone.')) {
				return;
			}
			deleteJSON('/questions/' + question._id, function () {
				table.removeChild(tr);
			});
		});
		deleteTd.appendChild(deleteButton);

		tr.appendChild(bodyTd);
		tr.appendChild(tagsTd);
		tr.appendChild(deleteTd);

		table.appendChild(tr);
	});
});

