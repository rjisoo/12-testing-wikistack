var chai = require('chai');
var expect = require('chai').expect;
var spies = require('chai-spies');
var models = require('../models');
var marked = require('marked');

var Page = models.Page;
var User = models.User;

chai.use(spies);
chai.should();
chai.use(require('chai-things'));

var syncDb = User.sync({
    force: true
  })
  .then(function() {
    return Page.sync({
      force: true
    })
  })

// var syncDb = Promise.all([
//     User.sync({force:true}), 
//     Page.sync({force:true})
//   ])


describe('Page model', function() {
  var page;

  // beforeEach(function() {
  //   page = Page.create({
  //       title: 'new Title',
  //       content: 'some__Content__',
  //       status: 'open',
  //       tags: ['apple', 'banana']
  //     })

  // });



  beforeEach(function(done) {

    pageCreate = syncDb.then(function() {
      Page.findOrCreate({
        where: {
          title: 'apple',
          content: 'very different__Content__',
          status: 'open',
          tags: ['apple']
        }
      }).then(function(){
         return Page.findOrCreate({
            where: {
              title: 'banana',
              content: 'very very very different__Content__',
              status: 'open',
              tags: ['banana']
            }
          })
      }).then(function(){
        done();
      }).catch(done);
     
      // Page.findOrCreate({
      //   where: {
      //     title: 'none',
      //     content: 'a little bit different__Content__',
      //     status: 'open',
      //     tags: ['none']
      //   }
      // })



      //  Page.findOrCreate({
      //   where: {
      //     title: 'apple and banana',
      //     content: 'some__Content__',
      //     status: 'open',
      //     tags: ['apple', 'banana']
      //   }
      // })
    })
  });


  describe('Virtuals', function() {
    describe('route', function() {
      xit('returns the url_name prepended by "/wiki/"', function() {
        //page.urlTitle = 'some_title';
        pageCreate.then(function(page) {
          expect(page.route).to.equal('/wiki/new_Title');
        });
      });
    });

    describe('renderedContent', function() {
      xit('converts the markdown-formatted content into HTML', function() {
        pageCreate.then(function(page) {
          expect(page.renderedContent).to.equal('<p>some<strong>Content</strong></p>\n');
        });
      });
    });
  });

  describe('Class methods', function() {
    describe('findByTag', function() {
      xit('gets pages with the search tag', function(done) {

        Page.findByTag('banana')
          .then(function(pages) {
            expect(pages).to.have.lengthOf(4);
            done();
          })
          .catch(done);
      });

      xit('does not get pages without the search tag', function(done) {

        Page.findByTag('orange')
          .then(function(pages) {
            expect(pages).to.have.lengthOf(0);
            done();
          })
          .catch(done);
      });
    });
  });

  describe('Instance methods', function() {
    describe('findSimilar', function() {
      xit('never gets itself', function() {
        pageCreate.then(function(page) {
          page[0].findSimilar().then(function(val) {
            expect(val.every(function(oneVal) {
              return oneVal.id !== page[0].id
            })).to.equal(true);
          })
        });
      });
      xit('gets other pages with any common tags', function() {
        var similarPage;

        pageCreate.then(function(page) {
          page[0].findSimilar().then(function(val) {
            similarPage = val;
            expect(val.every(function(oneVal) {
              return page[0].tags.filter(function(tag) {
                return oneVal.tags.indexOf(tag) !== -1;
              })
            })).to.equal(true);
          })
        });
      });
      xit('does not get other pages without any common tags', function() {
        pageCreate.then(function(page) {
          console.log('page 0', page[0].tags)
          page[0].findSimilar().then(function(val) {
            console.log('value 0', val[0].tags)
            console.log('value 1', val[1].tags)
          });
        });
      });
    });
  });

  describe('Validations', function() {
    xit('errors without title', function() {
      Page.create(
        {
          content: 'a little bit different__Content__',
          status: 'open',
          tags: ['none']
        }
      ).then(function(val) {
        console.log(val);
      }).catch(function(err) {
        expect(err.name).to.equal('SequelizeValidationError');
      })
    });
    it('errors without content', function() {
      Page.create(
        {
          title: 'newTitle2',
          content: undefined,
          status: 'open',
          tags: ['none']
        }
      ).then(function(val) {
        console.log(val);
      }).catch(function(err) {
        console.log(err);
        expect(err.name).to.equal('SequelizeValidationError');
      })
    });
    xit('errors given an invalid status', function(done) {
      Page.create({
          title: 'banana2',
          content: 'very very very different__Content__',
          status: '323open',
          tags: ['banana']
      }).then(function(page){
          done();
      }).catch(function(err){
        console.log(err);
          expect(err.name).to.equal('SequelizeValidationError');
      })
      // Page.create({
      //   title: 'newTitle222222',
      //   content: 'a little bit different__Content__',
      //   status: 'closed',
      //   tags: ['none']
      // }).then(function(val) {
      //   console.log(val);
      // }).catch(function(err) {
      //   console.log(err);
      //   
      //})
    });
  });

  describe('Hooks', function() {
    it('it sets urlTitle based on title before validating');
  });

});

describe('Testing suite capabilities', function() {
  xit('confirms basic arithmetic', function() {
    expect(2 + 2).to.equal(4);
  });

  xit('confirms setTimeout\'s timer accuracy', function(done) {
    var start = new Date();
    setTimeout(function() {
      var duration = new Date() - start;
      expect(duration).to.be.closeTo(1000, 50);
      done();
    }, 1000);
  });
  xit('spies on console...', function(done) {
    var obj = {
      foobar: function() {
        console.log('foo');
        return 'bar';
      }
    }
    chai.spy.on(obj, 'foobar');
    done();
  });
  xit('will invoke a function once per element', function() {
    var arr = ['x', 'y', 'z'];

    function logNth(val, idx) {
      console.log('Logging elem #' + idx + ':', val);
    }
    logNth = chai.spy(logNth);
    arr.forEach(logNth);
    expect(logNth).to.have.been.called.exactly(arr.length);
  });
});