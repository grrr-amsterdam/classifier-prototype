document.querySelector('.triggerRetrain').addEventListener('click', function () {
	getJSON('/retrain', function (data) {
		if (data.status === 'retrained') {
			alert('AI is now up to date');
		}
	});
});
