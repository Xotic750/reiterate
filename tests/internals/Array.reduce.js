/*jslint maxlen:80, es6:false, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it, beforeEach */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.reduce', function () {
    var testSubject;

    beforeEach(function () {
      testSubject = [1, 2, 3];
    });

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.reduce();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.reduce(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.reduce(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if function argument is not a function', function () {
      expect(function () {
        reiterate.$.reduce([]);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.reduce([], undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.reduce([], null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should pass the right parameters', function () {
      var array = ['1'];

      reiterate.$.reduce(array, function (prev, item, index, list) {
        expect(prev).to.be('');
        expect(item).to.be('1');
        expect(index).to.be(0);
        expect(list).to.be(array);
      }, '');
    });

    it('should start with the right initialValue', function () {
      var array = ['1'];

      reiterate.$.reduce(array, function (prev, item, index, list) {
        expect(prev).to.be(10);
        expect(item).to.be('1');
        expect(index).to.be(0);
        expect(list).to.be(array);
      }, 10);
    });


    it(
      'should not affect elements added to the array after it has begun',
      function () {
        var arr = [1, 2, 3],
          i = 0;

        reiterate.$.reduce(arr, function (a, b) {
          i += 1;
          if (i <= 4) {
            arr.push(a + 3);
          }

          return b;
        });

        expect(arr).to.eql([1, 2, 3, 4, 5]);
        expect(i).to.be(2);
      }
    );

    it('should work as expected for empty arrays', function () {
      expect(function () {
        reiterate.$.reduce([], function () {
          throw new Error('function should not be called!');
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should return the expected result', function () {
      expect(reiterate.$.reduce(testSubject, function (a, b) {
        return String(a || '') + String(b || '');
      })).to.eql(testSubject.join(''));
    });

    it('should not directly affect the passed array', function () {
      var copy = reiterate.$.chop(testSubject);

      reiterate.$.reduce(testSubject, function (a, b) {
        return a + b;
      });

      expect(testSubject).to.eql(copy);
    });

    it('should skip non-set values', function () {
      delete testSubject[1];
      var visited = {};

      reiterate.$.reduce(testSubject, function (a, b) {
        if (a) {
          visited[a] = true;
        }

        if (b) {
          visited[b] = true;
        }

        return 0;
      });

      expect(visited).to.eql({
        1: true,
        3: true
      });
    });

    it('should have a boxed object as list argument of callback', function () {
      var actual;

      reiterate.$.reduce('foo', function (previous, item, index, list) {
        /*jslint unparam: true */
        /*jshint unused: true */
        actual = list;
      });

      expect(typeof actual).to.be('object');
      expect(required.toStringTag(actual)).to.be('[object String]');
      expect(String(actual)).to.be('foo');
      expect(actual.charAt(0)).to.be('f');
    });

    if (required.isStrictMode()) {
      it('has the correct context ins strict mode', function () {
        var actual;

        reiterate.$.reduce([1], function () {
          actual = this;
        });

        expect(actual).to.be(undefined);

        reiterate.$.reduce([1, 2], function () {
          actual = this;
        });

        expect(actual).to.be(undefined);
      });
    }
  });
}());

/*jslint sloppy: true */
(function () {
  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.reduce', function () {
    it('has the correct context in non-strict mode', function () {
      var actual;

      reiterate.$.reduce([1], function () {
        actual = this;
      });

      expect(actual).to.be(undefined);

      reiterate.$.reduce([1, 2], function () {
        actual = this;
      });

      expect(actual).to.be(required.global);
    });
  });
}());
