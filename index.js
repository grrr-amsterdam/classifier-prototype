var app = require('express')();

app.set('port', process.env.PORT || 3000);

app.use(require('body-parser').json());

app.get('/', function (req, res) {
	res.sendfile('public/index.html');
});

app.get('/script.js', function (req, res) {
	res.sendfile('public/script.js');
});

app.post('/getTags', function (req, res) {
	res.send({
		data: require('./lib/classifier').getClassifications(req.body.question)
	});
});

app.listen(app.get('port'));

