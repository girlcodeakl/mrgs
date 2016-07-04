//set up
var database = null;
var express = require('express')
var app = express();
var bodyParser = require('body-parser')
//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//make an empty list of ideas
var posts = [];
var idea={};
idea.time=new Date();
idea.text ="This is a awesome pasta recipe I found! It serves 4 people and tastes amazing!";
idea.URL = "http://www.simplyrecipes.com/wp-content/uploads/2016/02/shrimp-pasta-vodka-horiz-a-1600.jpg";
idea.link = "http://www.simplyrecipes.com/recipes/shrimp_pasta_alla_vodka/"
idea.author = "Jane Doe"
posts.push(idea);

//let a client GET the list of ideas
var sendIdeasList = function (request, response) {
  response.send(posts);
}
app.get('/ideas', sendIdeasList);

//let a client POST new ideas
var saveNewIdea = function (request, response) {
  console.log(request.body.idea); //write it on the command prompt so we can see
  console.log(request.body.author);
  var idea = {};
  idea.text = request.body.idea;
  if ( request.body.URL === "")
  idea.URL= "http://also.kottke.org/misc/images/food-gradients-01.jpg";
  else
  idea.URL = request.body.URL;
  idea.author = request.body.author;
  idea.link = request.body.link;

  var prefix = "http://";
  var prefix2 ="https://";
  if (idea.link.substr(0, prefix.length) !== prefix && idea.link.substr(0,prefix2.length) !==prefix2){
    idea.link=prefix + idea.link;
  }
  else {
    idea.link=idea.link;
  }

  idea.time=new Date();
  posts.push(idea)
  response.send("thanks for your idea. Press back to add another");
  if(database!=null){
    var dbPosts = database.collection('posts');
    dbPosts.insert(idea);
  }
}
app.post('/ideas', saveNewIdea);
//listen for connections on port 3000
app.listen(process.env.PORT || 3000);
console.log("I am listening...");

var mongodb = require('mongodb');
var uri = 'mongodb://girlcode:mrgs@ds023704.mlab.com:23704/girlcode_mrgs';
mongodb.MongoClient.connect(uri, function(err, newdb) {
  if(err) {
    console.log( err);
    ;return;
  }
  console.log("yay we connected to the database");
  database = newdb;
  var dbPosts = database.collection('posts');
  dbPosts.find(function (err, cursor) {
    cursor.each(function (err, item) {
      if (item != null) {
        posts.push(item);
      }
    });
  });
});
