var mongoose = require('mongoose');
var User = mongoose.model('User');
var FriendRequest = mongoose.model('FriendRequest');

module.exports.viewFriends = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                if (err) {
                    res.status(400).json(err);
                } else if (!user) {
                    res.status(400).json({
                        "message": "InvalidRequestError: Invalid Token"
                    });
                } else {
                    User
                        .find({_id: {$in: user.friends}})
                        .exec(function (err, friends) {
                            if (err) {
                                res.status(400).json(err);
                            } else {
                                friends = friends.map(function (friend) {
                                    return friend.local.username;
                                });
                                res.status(200).json(friends);
                            }
                        })
                }
            });
    }
};

module.exports.viewOnlineFriends = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                if (err) {
                    res.status(400).json(err);
                } else if (!user) {
                    res.status(400).json({
                        "message": "InvalidRequestError: Invalid Token"
                    });
                } else {
                    User
                        .find({$and: [{_id: {$in: user.friends}}, {online: true}]})
                        .exec(function (err, friends) {
                            if (err) {
                                res.status(400).json(err);
                            } else {
                                friends = friends.map(function (friend) {
                                    return friend.local.username;
                                });
                                res.status(200).json(friends);
                            }
                        })
                }
            });
    }
};

module.exports.sendFriendRequest = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                if (err) {
                    res.status(400).json(err);
                } else if (!user) {
                    res.status(400).json({
                        "message": "InvalidRequestError: Invalid Token"
                    });
                } else {
                    User
                        .findById(req.params.id)
                        .exec(function (err, user) {
                            if (err) {
                                res.status(400).json(err);
                            } else if (!user) {
                                res.status(400).json({
                                    "message": "InvalidRequestError: Invalid :id"
                                });
                            } else {
                                FriendRequest
                                    .findOne({$and: [{requesterID: req.payload._id}, {recipientID: req.params.id}]})
                                    .exec(function (err, request) {
                                        if (err) {
                                            res.status(400).json(err);
                                        } else if (request) {
                                            res.status(400).json({
                                                "message": "InvalidResponseError: Friend Request Already Sent"
                                            });
                                        } else {
                                            FriendRequest
                                                .findOne({$and: [{requesterID: req.params.id}, {recipientID: req.payload._id}]})
                                                .exec(function (err, request) {
                                                    if (err) {
                                                        res.status(400).json(err);
                                                    } else if (request) {
                                                        res.status(400).json({
                                                            "message": "InvalidResponseError: Friend Request Already Sent to this User"
                                                        });
                                                    } else {
                                                        var newFriendRequest = new FriendRequest();

                                                        newFriendRequest.requesterID = req.payload._id;
                                                        newFriendRequest.recipientID = req.params.id;

                                                        newFriendRequest.save(function (err) {
                                                            if (err) {
                                                                res.status(400).json(err);
                                                            } else {
                                                                res.status(201).json({
                                                                    "message": "Request Sent Successfully"
                                                                })
                                                            }
                                                        });
                                                    }
                                                });
                                        }
                                    });
                            }
                        });
                }
            });
    }
};

module.exports.acceptFriendRequest = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                if (err) {
                    res.status(400).json(err);
                } else if (!user) {
                    res.status(400).json({
                        "message": "InvalidRequestError: Invalid Token"
                    });
                } else {
                    User
                        .findById(req.params.id)
                        .exec(function (err, user) {
                            if (err) {
                                res.status(400).json(err);
                            } else if (!user) {
                                res.status(400).json({
                                    "message": "InvalidRequestError: Invalid :id"
                                });
                            } else {
                                FriendRequest
                                    .findOne({$and: [{requesterID: req.params.id}, {recipientID: req.payload._id}]})
                                    .exec(function (err, request) {
                                        if (err) {
                                            res.status(400).json(err);
                                        } else if (request) {
                                            User
                                                .findById(req.params.id)
                                                .exec(function (err, user) {
                                                    if (err) {
                                                        res.status(400).json(err);
                                                    } else {
                                                        user.friends.push(req.payload._id);
                                                        user.save();
                                                    }
                                                });
                                            User
                                                .findById(req.payload._id)
                                                .exec(function (err, user) {
                                                    if (err) {
                                                        res.status(400).json(err);
                                                    } else {
                                                        user.friends.push(req.params.id);
                                                        user.save();
                                                    }
                                                });
                                            res.status(200).json({
                                                "message": "Accepted successfully"
                                            });
                                        } else {
                                            res.status(400).json({
                                                "message": "InvalidResponseError: No Friend Request"
                                            })
                                        }
                                    });
                                FriendRequest.remove({$and: [{requesterID: req.params.id}, {recipientID: req.payload._id}]});
                            }
                        });
                }
            });
    }
};

module.exports.declineFriendRequest = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                if (err) {
                    res.status(400).json(err);
                } else if (!user) {
                    res.status(400).json({
                        "message": "InvalidRequestError: Invalid Token"
                    });
                } else {
                    User
                        .findById(req.params.id)
                        .exec(function (err, user) {
                            if (err) {
                                res.status(400).json(err);
                            } else if (!user) {
                                res.status(400).json({
                                    "message": "InvalidRequestError: Invalid :id"
                                });
                            } else {
                                FriendRequest.remove({$and: [{requesterID: req.params.id}, {recipientID: req.payload._id}]});
                                res.status(200).json({
                                    "message": "Declined successfully"
                                });
                            }
                        });
                }
            });
    }
};

module.exports.friendRequests = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        FriendRequest
            .find({recipientID: req.payload._id})
            .exec(function (err, requests) {
                if (err) {
                    res.status(400).json(err);
                } else {
                    requests = requests.map(function (request) {
                        return request.requesterID;
                    });
                    res.status(200).json(requests);
                }
            })
    }
};

module.exports.sentRequests = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        FriendRequest
            .find({requesterID: req.payload._id})
            .exec(function (err, requests) {
                if (err) {
                    res.status(400).json(err);
                } else {
                    requests = requests.map(function (request) {
                        return request.recipientID;
                    });
                    res.status(200).json(requests);
                }
            })
    }
};
