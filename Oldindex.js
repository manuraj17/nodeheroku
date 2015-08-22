var express = require('express');
var app = express();
var sqlite3 = require('sqlite3');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var MongoStore = require('connect-mongo')
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

//Sessions
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    store: new MongoStore({
        url: 'mongodb://localhost/test-app',
        touchAfter: 24 * 3600 // time period in seconds
    })
}));


//The database part
//The database
db = new sqlite3.Database('notes.db');

//Initializing database
//User database
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", function(err, rows){
  if(err !== null){
    console.log(err);
  }
  else if(rows === undefined){
    db.run('CREATE TABLE "users" ( "uid" INTEGER PRIMARY KEY AUTOINCREMENT, "username" VARCHAR(10), "pass" VARCHAR(255))', function(err){
      if(err!== null){
        console.log(err);
      }
      else{
        console.log("SQL table 'users' initialized");

      }

    });
  }
  else {
    console.log("SQL table 'users' already initialized");
  }
});

//Password Database
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='auth'", function(err, rows){
  if(err !== null){
    console.log(err);
  }
  else if(rows === undefined){
    db.run('CREATE TABLE "auth" ( "uid" INTEGER PRIMARY KEY AUTOINCREMENT, "username" VARCHAR(10), "salt" VARCHAR(128), "hash" VARCHAR(255))', function(err){
      if(err!== null){
        console.log(err);
      }
      else{
        console.log("SQL table 'auth' initialized");
      }
    });
  }
  else {
    console.log("SQL table 'auth' already initialized");
  }
});



//Initializing database
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='posts'",
       function(err, rows) {
  if(err !== null) {
    console.log(err);
  }
  else if(rows === undefined) {
    db.run('CREATE TABLE "posts" ' +
           '("id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
           '"title" VARCHAR(255), ' +
           '"content" VARCHAR(255))', function(err) {
      if(err !== null) {
        console.log(err);
      }
      else {
        console.log("SQL Table 'posts' initialized.");
      }
    });
  }
  else {
    console.log("SQL Table 'posts' already initialized.");
  }
});


//The environments
var port = process.env.PORT || 8080;
var host = process.env.HOST || "127.0.0.1";


app.use(bodyParser.urlencoded({ //Why
  extended: true
}));

/*//Test data
var posts = [
  {
    "title":"Quicksand",
    "content":"And there shall be light"
  }
];

posts.push({title:"Time", content:"And you shall run along"});
*/

app.use(express.static(path.join(__dirname, 'public')));//Second Argument is the folder to be made public
//app.use(express.cookieParser());
app.set('views', path.join(__dirname,'templates')); // This is for jade template engine
app.set('view engine', 'jade');

app.get("/login", function(req, res){
  res.render("login");
})

app.post('/authenticate', function(req, res){

  username = req.body.username;
  password = req.body.password;

  sqlRequest = "SELECT * FROM auth WHERE username = '" + username + "'";
  db.run(sqlRequest, function(err) {
  if(err !== null) {
    next(err);
  }
  else {

    res.redirect('/');
    //res.redirect('back');
    }
  });
});


app.post('/register', function(req, res){

  username = req.body.username;
  password = req.body.password;

  sqlRequest = "SELECT * FROM auth WHERE username = '" + username + "'";
  db.run(sqlRequest, function(err) {
  if(err !== null) {
    next(err);
  }
  else {

    res.redirect('/');
    //res.redirect('back');
    }
  });
});


app.get("/",function(req, res){

    db.all('SELECT * FROM posts ORDER BY title', function(err, row) {
    if(err !== null) {
      // Express handles errors via its next function.
      // It will call the next operation layer (middleware),
      // which is by default one that handles errors.
      //next(err);
    }
    else {
      console.log(row);
      res.render('index', {"posts": row}, function(err, html) {
        res.status(200).send(html);
      });
    }
  });
});



  //res.render('newnewindex', {"posts" : posts });
  // res.sendFile('index.html');
  //res.end("Hello World!");
//});

app.get("/newpost", function(req, res){
  res.render('newPost', title="");
})

app.post("/add", function(req, res){
  //posts.push(req.body);
  title = req.body.title;
  content = req.body.content;
  sqlRequest = "INSERT INTO 'posts' (title, content) " +
             "VALUES('" + title + "', '" + content + "')"
  db.run(sqlRequest, function(err) {
  if(err !== null) {
    next(err);
  }
  else {
    res.redirect('/');
    //res.redirect('back');
  }

  });
});

app.get('/delete/:id', function(req, res) {
  //posts.splice(req.params.id, 1);
  //res.redirect('/');
  db.run("DELETE FROM posts WHERE id='" + req.params.id + "'",
         function(err) {
    if(err !== null) {
      next(err);
    }
    else {
      res.redirect('/');
    }
  });
});



app.listen(port, host, function(){
  //console.log("Notes started at Port: "+ port+"\n");
  console.log("Server listening to %s:%d within %s environment", host, port, app.get('env'));
});
