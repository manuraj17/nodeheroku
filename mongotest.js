//Lets load the mongoose module in our program
var mongoose = require('mongoose');

//Lets connect to our database using the DB server URL.
mongoose.connect('mongodb://localhost/mongoose_test');

/**
 * Lets define our Model for User entity. This model represents a collection in the database.
 * We define the possible schema of User document and data types of each field.
 * */
var User = mongoose.model('User', {name: String, roles: Array, age: Number});

/**
 * Lets Use our Models
 * */

//Lets create a new user
//var user1 = new User({name: 'manu', age: 23, roles: ['admin', 'moderator', 'user']});

//Some modifications in user object
//user1.name = user1.name.toUpperCase();

//Lets try to print and see it. You will see _id is assigned.
//console.log(user1);

/*
//Lets save it
user1.save(function (err, userObj) {
  if (err) {
    console.log(err);
  } else {
    console.log('saved successfully:', userObj);
  }
});
*/
User.findOne({name: 'MANU'}, function (err, userObj) {
  if (err) {
    console.log(err);
  } else if (userObj) {
    console.log('Found:', userObj);

    //For demo purposes lets update the user on condition.
    if (userObj.age != 30) {
      //Some demo manipulation
      userObj.age += 30;

      //Lets save it
      userObj.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Updated', userObj);
        }
      });
    }
  } else {
    console.log('User not found!');
  }
});
