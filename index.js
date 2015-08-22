/*

To Do: Sessions
*/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var path = require('path');
//Temporary content variable
var posts = [
  { id : "0",
    title: "Hello World",
    content: "First post for the world."
  },
  {
    id: "1",
    title: "To infinity and beyond.",
    content: "To infiinity and beyond into the wilderness of the extravagant."
  }
];
//To limit the posts to be 5
var counter = 1;

//The environments
var port = process.env.PORT || 8080;
var host = process.env.HOST || "127.0.0.1";


app.use(bodyParser.urlencoded({ //Why
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));//Second Argument is the folder to be made public
app.set('views', path.join(__dirname,'templates')); // This is for jade template engine
app.set('view engine', 'jade');

var deletePost = function(post, id){
  if(post.id !== id)
    return post;
}

 //Routing.
 app.get('/test', function(req, res) {
   res.end("Testing 101");
 });

 app.get('/', function(req, res) {
   console.log("Inside GET");
   console.log(posts);
   res.render('index', {"posts" : posts});
 });

 app.get('/delete/:id', function(req, res) {
   var id = req.params.id;
   console.log("To delete post %d", id);
   //posts.splice(req.params.id  , 1);
   posts = posts.filter(function(post) {
     if(post.id != id){
       return post;
     }
   });
   console.log("after delete" );
   console.log(posts);

   res.redirect('/');
 });

 app.post('/add', function(req, res) {
   if(counter < 6 ){
     counter++;
     title = req.body.title;
     content = req.body.content;
     console.log( counter + ' ' + title + ' ' + content);
     var post = { "id": counter, "title" : title, "content": content };
     posts.push(post);
     //res.redirect('/');
   }

   res.redirect('/');

 });

 app.get("/newpost", function(req, res){
   res.render('newPost', title="");
 })

 app.listen(port, host, function(){
   //console.log("Notes started at Port: "+ port+"\n");
   console.log("Server listening to %s:%d within %s environment", host, port, app.get('env'));
 });
