process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();

var http = require('http');
var server = require('../bin/www');
var models = require('../models');
var bcrypt = require('bcrypt');
var io = require('../io');

//var server = http.createServer(app);
var app = require('../app');
var agent = chai.request.agent(server);


function checkPassword(given_password, db_password) {
  return bcrypt.compare(given_password, db_password);
}

// clear database
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

// Testing Index
describe('Testing Index', function() {
  describe('/', function() {
    it('Can hit homepage', function(done) {
      chai.request(app).get('/').send().end(function(err, res) {
        res.should.have.status(200);
        done();
      });
    });
  });
});

// Testing Users
describe('Testing Users', function() {
  describe('Joining', function() {
    it('Users can join 1', function(done) {
      chai.request(app).post('/user/join').type('form').send({
        'joinUsername': 'chimichangas',
        'joinPassword': 'andtabasco',
        'joinBalance': 100,
      }).end(function(err, res) {
        res.should.have.status(200);
        res.should.redirectTo(res.request.protocol + '//' + res.request.host + '/');
        done();
      });
    });

    it('Users can join 2', function(done) {
      chai.request(app).post('/user/join').type('form').send({
        'joinUsername': 'flautas',
        'joinPassword': 'yqueso',
        'joinBalance': 50,
      }).end(function(err, res) {
        res.should.have.status(200);
        res.should.redirectTo(res.request.protocol + '//' + res.request.host + '/');
        done();
      });
    });

    it('Users cannot join with a taken username', function(done) {
      chai.request(app).post('/user/join').type('form').send({
        'joinUsername': 'chimichangas',
        'joinPassword': 'yburritos',
        'joinBalance': 75,
      }).end(function(err, res) {
        res.should.have.status(400);
        done();
      });
    });
  });

  describe('Login', function() {
    it('Users can login with correct password', function(done) {
      agent.post('/user/login').type('form').send({
        loginUsername: 'chimichangas',
        loginPassword: 'andtabasco'
      }).end(function(err, res) {
        res.should.have.status(200);
        res.should.redirectTo(res.request.protocol + '//' + res.request.host + '/');
        done();
      });
    });

    it('Users are blocked by incorrect password', function(done) {
      chai.request(app).post('/user/login').type('form').send({
        loginUsername: 'chimichangas',
        loginPassword: 'enchiladas' // wrong password
      }).end(function(err, res) {
        res.should.have.status(401);
        done();
      });
    });

    it('Users cannot login to nonexistant account', function(done) {
      chai.request(app).post('/user/login').type('form').send({
        loginUsername: 'tacos',
        loginPassword: 'andtabasco'
      }).end(function(err, res) {
        res.should.have.status(404);
        done();
      });
    });
  });

  describe('Change Password', function() {
    it('Users can change password', function(done) {
      agent.post('/user/changepassword').type('form').send({
        newPassword: 'taquito'
      }).end(function(err, res) {
        console.log(err);
        res.should.have.status(200);
        res.should.redirectTo(res.request.protocol + '//' + res.request.host + '/');
        done();
      });
    });



  });

  describe('Logout', function() {
    it('Users can logout', function(done) {
      chai.request(app).get('/user/logout').send().end(function(err, res) {
        res.should.have.status(200);
        res.should.redirectTo(res.request.protocol + '//' + res.request.host + '/');
        done();
      });
    });



  });

  describe('/username', function() {
    it('Can get user profile', function(done) {
      var given_user = 'chimichangas';
      agent.get(`/user/${given_user}`).send().end(function(err, res) {
        res.should.have.status(200);
        done();
      });
    });

    it('Cannot get nonexistant user profile', function(done) {
      agent.get('/user/notauser').send().end(function(err, res) {
        res.should.have.status(200); //because the github 404 is found OK, hence 200
        res.should.redirectTo('https://github.com/404');
        done();
      });
    });

    it('Cannot view user profiles unless logged in', function(done) {
      var given_user = 'chimichangas';
      chai.request(app).get(`/user/${given_user}`).send().end(function(err, res) {
        res.should.have.status(403);
        done();
      });
    });
  });


  describe('Follow', function() {
    it('Can follow', function(done) {
      models.User.findAll({
        where: {
          username: 'flautas'
        }
      }).then(function(users) {
        agent.post(`/user/${users[0].id}/follow`).send().end(function(err, res) {
          console.log(res.body);
          res.should.have.status(200);
          done();
        });
      });
    });

    // it('Can follow (friend) back', function(done) {
    //   chai.request(app).get('/user/logout').send().end(function(err, res) {
    //     agent.post('/user/login').type('form').send({
    //       loginUsername: 'flautas',
    //       loginPassword: 'yqueso'
    //     }).end(function(err, res) {
    //       models.User.findAll({
    //         where: {
    //           username: 'chimichangas'
    //         }
    //       }).then(function(users) {
    //         agent.post(`/user/${users[0].id}/follow`).send().end(function(err, res) {
    //           console.log(res.body);
    //           res.should.have.status(200);
    //           done();
    //         });
    //       });
    //     });
    //   });
    // });



  });

  describe('Unfriend', function() {
    // it('Users can unfriend', function(done) {
    //   // chai.request(app).post('/user/join').send({
    //   //   joinUsername: 'chimichangas',
    //   //   joinPassword: 'andtabasco',
    //   //   joinBalance: 100,
    //   // }).end(function(err, res) {
    //   //   user.username.should.equal('chimichangas');
    //   //   user.password.should.equal('andtabasco');
    //   //   user.balance.should.equal(100);
    //   //   done();
    //   // });
    // });


  });

  describe('Unfollow', function() {
    // it('Users can unfollow', function(done) {
    //   // chai.request(app).post('/user/join').send({
    //   //   joinUsername: 'chimichangas',
    //   //   joinPassword: 'andtabasco',
    //   //   joinBalance: 100,
    //   // }).end(function(err, res) {
    //   //   user.username.should.equal('chimichangas');
    //   //   user.password.should.equal('andtabasco');
    //   //   user.balance.should.equal(100);
    //   //   done();
    //   // });
    // });


  });



});

// Testing Posts
describe('Testing Posts', function() {
  describe('Posting', function() {
    // it('Users can post', function(done) {
    //   // chai.request(app).post('/user/join').send({
    //   //   joinUsername: 'chimichangas',
    //   //   joinPassword: 'andtabasco',
    //   //   joinBalance: 100,
    //   // }).end(function(err, res) {
    //   //   user.username.should.equal('chimichangas');
    //   //   user.password.should.equal('andtabasco');
    //   //   user.balance.should.equal(100);
    //   //   done();
    //   // });
    // });


  });

  describe('Like', function() {
    // it('Users can like', function(done) {
    //   // chai.request(app).post('/user/join').send({
    //   //   joinUsername: 'chimichangas',
    //   //   joinPassword: 'andtabasco',
    //   //   joinBalance: 100,
    //   // }).end(function(err, res) {
    //   //   user.username.should.equal('chimichangas');
    //   //   user.password.should.equal('andtabasco');
    //   //   user.balance.should.equal(100);
    //   //   done();
    //   // });
    // });


  });


  describe('Unlike', function() {
    // it('Users can unlike', function(done) {
    //   // chai.request(app).post('/user/join').send({
    //   //   joinUsername: 'chimichangas',
    //   //   joinPassword: 'andtabasco',
    //   //   joinBalance: 100,
    //   // }).end(function(err, res) {
    //   //   user.username.should.equal('chimichangas');
    //   //   user.password.should.equal('andtabasco');
    //   //   user.balance.should.equal(100);
    //   //   done();
    //   // });
    // });


  });


});

agent.close();