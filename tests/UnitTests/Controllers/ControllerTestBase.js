var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var User = require('../../../main/server/model/users');
var FriendRequest = require('../../../main/server/model/friendRequest');

process.env.mode = 'TESTING';

mockgoose.prepareStorage().then(function() {
    mongoose.connect('mongodb://localhost/plan-test');
});

// Creates a user, stores it in the mocked database and returns it
module.exports.createUser = function (username, online, friends) {
    var newUser = new User();

    newUser.local.username = username;
    newUser.setPassword("test");
    newUser.online = online;
    newUser.friends = friends;

    newUser.save();
    return newUser;

};

module.exports.createFriendRequest = function (sender, sentTo) {
    var newRequest = new FriendRequest();

    newRequest.requesterID = sender;
    newRequest.recipientID = sentTo;

    newRequest.save();
    return newRequest;
};

module.exports.deleteUsers = function () {
    User.remove({}, function(err) {});
};

module.exports.deleteRequests = function () {
    FriendRequest.remove({}, function(err) {});
};

module.exports.addFriend = function (username, id) {
    User
        .findOne({"local.username": username})
        .exec(function (err, user) {
            if (err) {
                console.log(err)
            } else if (!user) {
                console.log('user not found')
            } else {
                user.friends = user.friends.append(id);
                user.save();
            }
        })
};
