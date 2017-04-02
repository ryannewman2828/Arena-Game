var testBase = require("./ControllerTestBase");
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var app = require('../../../main/app');

chai.use(chaiHttp);

describe('Login', function() {
    it('should return an error when one field is empty on /login POST', function (done) {
        chai.request(app)
            .post('/api/login')
            .send({
                username : "tester",
                password : ""
            })
            .end(function(err, res){
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.be.a('string');
                res.body.message.should.be.equal("Missing credentials");
                done();
            });
    });
    it("should return an error if the user doesn't exist on /login POST", function (done) {
        chai.request(app)
            .post('/api/login')
            .send({
                username : "tester",
                password : "test"
            })
            .end(function(err, res){
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.be.a('string');
                res.body.message.should.be.equal("InvalidResponseError: User doesn't exists");
                done();
            });
    });
    it('should return an error if the password is incorrect on /login POST', function (done) {
        user = testBase.createUser('tester', false, []);
        chai.request(app)
            .post('/api/login')
            .send({
                username : "tester",
                password : "foo"
            })
            .end(function(err, res){
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.be.a('string');
                res.body.message.should.be.equal("InvalidResponseError: Password isn't correct");
                done();
            });
    });
    it('should return a 200 if the users login is successful on /login POST', function (done) {
        user = testBase.createUser('tester', false, []);
        chai.request(app)
            .post('/api/login')
            .send({
                username : "tester",
                password : "test"
            })
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.token.should.be.a('string');
                done();
            });
    });
    afterEach(function(done){
        testBase.deleteUsers();
        done();
    });
});

describe('Register', function () {
    it('should return an error when one field is empty on /register POST', function (done) {
        chai.request(app)
            .post('/api/register')
            .send({
                username : "tester",
                password : "",
                confirmPass: "test"
            })
            .end(function(err, res){
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.be.a('string');
                res.body.message.should.be.equal("InvalidRequestError: Empty Fields");
                done();
            });
    });
    it('should return an error when all fields are empty on /register POST', function (done) {
        chai.request(app)
            .post('/api/register')
            .send({
                username : "",
                password : "",
                confirmPass: ""
            })
            .end(function(err, res){
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.be.a('string');
                res.body.message.should.be.equal("InvalidRequestError: Empty Fields");
                done();
            });
    });
    it("should return an error when the passwords don't match on /register POST", function (done) {
        chai.request(app)
            .post('/api/register')
            .send({
                username : "tester",
                password : "foo",
                confirmPass: "bar"
            })
            .end(function(err, res){
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.be.a('string');
                res.body.message.should.be.equal("InvalidRequestError: Passwords Don't Match");
                done();
            });
    });
    it('should return an error when the username is already taken on /register POST', function (done) {
        testBase.createUser('tester', false, []);
        chai.request(app)
            .post('/api/register')
            .send({
                username : "tester",
                password : "foo",
                confirmPass: "foo"
            })
            .end(function(err, res){
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.be.a('string');
                res.body.message.should.be.equal("InvalidResponseError: User Already Exists");
                done();
            });
    });
    it('should return a 200 if the user is successfully registered on /register POST', function (done) {
        chai.request(app)
            .post('/api/register')
            .send({
                username : "tester",
                password : "foo",
                confirmPass: "foo"
            })
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.token.should.be.a('string');
                done();
            });
    });
    afterEach(function(done){
        testBase.deleteUsers();
        done();
    });
});
