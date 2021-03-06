var p = require('..')
  , assert = require('assert')
  , EventEmitter = require('events').EventEmitter


describe('Group', function() {
  var g = p.createGroup()
    , a = 0
    , b = 0
    , c = false
  
  var ee = g.add(new EventEmitter());
  ee.on('a', function() {
    a++;
  });

  g.setInterval(function() {
    ee.emit('a');
  }, 1000);

  g.setInterval(function() {
    b++;
  }, 1000);

  g.setTimeout(function() {
    c = true;
  }, 100);

  it('Has correct amount of timers', function() {
    assert.equal(g.timers().length, 4);
  });

  it('Correctly calls functions and listeners', function(done) {
    setTimeout(function() {
      assert.equal(a, 1);
      assert.equal(b, 1);
      assert.ok(c);
      done();
    }, 1001);
  });

  describe('Pause for a given time', function() {
    it('Calls will be delayed', function(done) {
      g.pause(300);

      setTimeout(function() {
        assert.equal(a, 1);
        assert.equal(b, 1);
        done();
      }, 1000);
    });

    describe('Clear', function() {
      it('EventEmitter will still be there', function(done) {
        g.clear();

        setTimeout(function() {
          assert.equal(g.timers().length, 1);
          assert.equal(a, 2);
          assert.equal(b, 2);
          assert.ok(c);
          done();
        }, 1000);
      });
    });

  });
});
