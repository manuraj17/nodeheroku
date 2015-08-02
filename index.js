var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');

app.get('/', function(request, response) {
  response.render('index');
});

app.get('/newPost', function(request, response) {
  response.render('newPost');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
