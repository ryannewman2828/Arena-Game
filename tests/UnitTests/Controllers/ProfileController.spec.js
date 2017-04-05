var testBase = require("./ControllerTestBase");
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var app = require('../../../main/app');

chai.use(chaiHttp);

describe('Profile Read', function() {
    it('should give a 401 if not authenticated on /profile GET', function(done) {
        chai.request(app)
            .get('/api/profile')
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });
    it('should give a 401 if not authenticated on /profile?user=fail GET', function(done) {
        testBase.createUser('tester', false, []);
        chai.request(app)
            .get('/api/profile?user=fail')
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });
    it('should return a 400 when given an incorrect token /profile GET', function(done) {
        chai.request(app)
            .get('/api/profile')
            .set('Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                'eyJfaWQiOiI1OGUwMjVhMmMwZGViNzBjNTQ5MWY4MzQ' +
                'iLCJ1c2VybmFtZSI6InRlc3RlciIsImV4cCI6MTQ5MT' +
                'Y4OTUwNiwiaWF0IjoxNDkxMDg0NzA2fQ.' +
                'djaXe_inBp9X3DbsSMOeHl8qfk32l9ig6G6-B9dLrUM')
            .end(function(err, res){
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.be.a('string');
                res.body.message.should.be.equal('InvalidRequestError: Invalid Token');
                res.should.have.status(400);
                done();
            });
    });
    it('should return a 400 when given an incorrect token /profile?user=invalid GET', function(done) {
        chai.request(app)
            .get('/api/profile?user=invalid')
            .set('Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                'eyJfaWQiOiI1OGUwMjVhMmMwZGViNzBjNTQ5MWY4MzQ' +
                'iLCJ1c2VybmFtZSI6InRlc3RlciIsImV4cCI6MTQ5MT' +
                'Y4OTUwNiwiaWF0IjoxNDkxMDg0NzA2fQ.' +
                'djaXe_inBp9X3DbsSMOeHl8qfk32l9ig6G6-B9dLrUM')
            .end(function(err, res){
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.be.a('string');
                res.body.message.should.be.equal('InvalidRequestError: Invalid Token');
                res.should.have.status(400);
                done();
            });
    });
    it('should return the user when authenticated on /profile GET', function (done) {
        var user = testBase.createUser('tester', false, []);
        var jwt = user.generateJwt();
        chai.request(app)
            .get('/api/profile')
            .set('Authorization', 'Bearer ' + jwt)
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body._id.should.be.a('string');
                res.body.online.should.be.a('boolean');
                res.body.friends.should.be.a('array');
                res.body.local.username.should.be.a('string');
                res.body.online.should.be.false;
                res.body.friends.should.be.empty;
                res.body.local.username.should.be.equal('tester');
                done();
            });
    });
    it('should return the user when authenticated on /profile?user=tester2 GET', function (done) {
        var user = testBase.createUser('tester', false, []);
        testBase.createUser('tester2', false, []);
        var jwt = user.generateJwt();
        chai.request(app)
            .get('/api/profile?user=tester2')
            .set('Authorization', 'Bearer ' + jwt)
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body._id.should.be.a('string');
                res.body.online.should.be.a('boolean');
                res.body.friends.should.be.a('array');
                res.body.local.username.should.be.a('string');
                res.body.online.should.be.false;
                res.body.friends.should.be.empty;
                res.body.local.username.should.be.equal('tester2');
                done();
            });
    });
    afterEach(function(done){
        testBase.deleteUsers();
        done();
    });
});

describe('Users Profile Read', function() {

    afterEach(function(done){
        testBase.deleteUsers();
        done();
    });
});

describe('Online Profile Read', function() {
    it('should give a 401 if not authenticated on /profile/online GET', function (done) {
        chai.request(app)
            .get('/api/profile/online')
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });
    it('should return the online users when authenticated on /profile/online GET', function (done) {
        var user1 = testBase.createUser('tester1', true, []);
        testBase.createUser('tester2', false, []);
        testBase.createUser('tester3', true, []);
        jwt = user1.generateJwt();
        chai.request(app)
            .get('/api/profile/online')
            .set('Authorization', 'Bearer ' + jwt)
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.include('tester1');
                res.body.should.include('tester3');
                done();
            });
    });
    it('should return nothing if everyone is offline on /profile/online GET', function (done) {
        var user1 = testBase.createUser('tester1', false, []);
        testBase.createUser('tester2', false, []);
        testBase.createUser('tester3', false, []);
        jwt = user1.generateJwt();
        chai.request(app)
            .get('/api/profile/online')
            .set('Authorization', 'Bearer ' + jwt)
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.be.empty;
                done();
            });
    });
    it('should return everything if everyone is online on /profile/online GET', function (done) {
        var user1 = testBase.createUser('tester1', true, []);
        testBase.createUser('tester2', true, []);
        testBase.createUser('tester3', true, []);
        jwt = user1.generateJwt();
        chai.request(app)
            .get('/api/profile/online')
            .set('Authorization', 'Bearer ' + jwt)
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.include('tester1');
                res.body.should.include('tester2');
                res.body.should.include('tester3');
                done();
            });
    });
    afterEach(function(done){
        testBase.deleteUsers();
        done();
    });
});
