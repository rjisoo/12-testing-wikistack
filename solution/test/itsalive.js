var chai = require('chai');
var expect = require('chai').expect;
var spies = require('chai-spies');
chai.use(spies);


describe('Testing suite capabilities', function () {
  it('confirms basic arithmetic', function () {
    expect(2+2).to.equal(4);
  });

  it('confirms setTimeout\'s timer accuracy', function (done) {
  var start = new Date();
  setTimeout(function () {
    var duration = new Date() - start;
    expect(duration).to.be.closeTo(1000, 50);
    done();
  }, 1000);
});
});