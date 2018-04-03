process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();

var app = require('../app');
var models = require('../models');

//clear database
before(function(done) {
  models.FollowerFollowed.destroy({
    where: {},
    truncate: true,
    cascade: true
  }).then(function() {
    models.User.destroy({
      where: {},
      truncate: true,
      cascade: true
    }).then(function() {
      models.Post.destroy({
        where: {},
        truncate: true,
        cascade: true
      }).then(done());
    });
  });
});



//Testing Users
describe('Testing Users', function() {
  describe('Joining', function() {
    it('Users can join', function() {
      chai.request(app).post('/user/join').send(({
        joinUsername: 'chimichangas',
        joinPassword: 'andtabasco',
        joinBalance: 100,
      })).end(function(err, user) {
        user.username.should.equal('chimichangas');
        user.password.should.equal('andtabasco');
        user.balance.should.equal(100);
        done();
      });
    });

    it('Users can join', function() {
      chai.request(app).post('/user/join').send(({
        joinUsername: 'chimichangas',
        joinPassword: 'andqueso',
        joinBalance: 90,
      })).end(function(err, user) {
        user.username.should.equal('chimichangas');
        user.password.should.equal('andtabasco');
        user.balance.should.equal(100);
        done();
      });
    });
  });


});