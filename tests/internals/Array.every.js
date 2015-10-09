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

  describe('Array.every', function () {
    var lastIndex = Math.pow(2, 32) - 1,
      everyArray = required.create(
        0,
        1,
        2,
        'a',
        'b',
        'c', [8, 9, 10], {},
        true,
        false,
        undefined,
        null,
        new Date(),
        new Error('x'),
        new RegExp('t'),
        Infinity, -Infinity
      ),
      testSubject,
      testIndex,
      expected,
      numberOfRuns;

    beforeEach(function () {
      testSubject = required.create(
        2,
        3,
        undefined,
        true,
        'hej',
        null,
        false,
        0,
        8,
        9
      );
      delete testSubject[1];
      delete testSubject[8];
      numberOfRuns = 0;
      expected = {
        0: 2,
        2: undefined,
        3: true
      };
    });

    everyArray.length = 25;
    everyArray[24] = NaN;
    everyArray[25] = 'end';

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.every();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.every(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.every(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if function argument is not a function', function () {
      expect(function () {
        reiterate.$.every(everyArray);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.every(everyArray, undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.every(everyArray, null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should not throw an error in each case', function () {
      var result = reiterate.$.every(
        everyArray,
        function (element, index, array) {
          expect(array).to.be(everyArray);
          expect(typeof index === 'number').to.be.ok();
          expect(index >= 0).to.be.ok();
          expect(index <= lastIndex).to.be.ok();
          if (reiterate.$.numIsNaN(element)) {
            expect(reiterate.$.numIsNaN(everyArray[index])).to.be(true);
          } else {
            expect(element).to.be(everyArray[index]);
          }

          testIndex = index;
          if (element === 'end') {
            return false;
          }

          return true;
        });

      expect(result).to.be(false);

      expect(testIndex).to.be(everyArray.length - 1);
    });

    it('should pass the right parameters', function () {
      var array = ['1'];

      reiterate.$.every(array, function (item, index, list) {
        expect(item).to.be('1');
        expect(index).to.be(0);
        expect(list).to.be(array);
      });
    });

    it(
      'should not affect elements added to the array after it has begun',
      function () {
        var arr = [1, 2, 3],
          i = 0;

        reiterate.$.every(arr, function (a) {
          i += 1;
          arr.push(a + 3);

          return i <= 3;
        });

        expect(arr).to.eql([1, 2, 3, 4, 5, 6]);
        expect(i).to.be(3);
      }
    );

    it('should set the right context when given none', function () {
      var context;

      reiterate.$.every([1], function () {
        context = this;
      });

      expect(context).to.be((function () {
        return function () {
          return this;
        };
      }()).call());
    });

    it('should return true if it runs to the end', function () {
      var actual = reiterate.$.every(testSubject, function () {
        return true;
      });

      expect(actual).to.be.ok();
    });

    it('should return false if it is stopped somewhere', function () {
      var actual = reiterate.$.every(testSubject, function () {
        return false;
      });

      expect(actual).to.not.be.ok();
    });

    it('should return true if there are no elements', function () {
      var actual = reiterate.$.every([], function () {
        return true;
      });

      expect(actual).to.be.ok();
    });

    it('should stop after 3 elements', function () {
      var actual = {};

      reiterate.$.every(testSubject, function (obj, index) {
        actual[index] = obj;
        numberOfRuns += 1;
        if (numberOfRuns === 3) {
          return false;
        }

        return true;
      });

      expect(actual).to.eql(expected);
    });

    it('should stop after 3 elements using a context', function () {
      var actual = {},
        o = {
          a: actual
        };

      reiterate.$.every(testSubject, function (obj, index) {
        this.a[index] = obj;
        numberOfRuns += 1;
        if (numberOfRuns === 3) {
          return false;
        }

        return true;
      }, o);

      expect(actual).to.eql(expected);
    });

    it('should stop after 3 elements in an array-like object', function () {
      var ts = Object(testSubject),
        actual = {};

      reiterate.$.every(ts, function (obj, index) {
        actual[index] = obj;
        numberOfRuns += 1;
        if (numberOfRuns === 3) {
          return false;
        }

        return true;
      });

      expect(actual).to.eql(expected);
    });

    it(
      'should stop after 3 elements in an array-like object using a context',
      function () {
        var ts = Object(testSubject),
          actual = {},
          o = {
            a: actual
          };

        reiterate.$.every(ts, function (obj, index) {
          this.a[index] = obj;
          numberOfRuns += 1;
          if (numberOfRuns === 3) {
            return false;
          }

          return true;
        }, o);

        expect(actual).to.eql(expected);
      }
    );

    it('should have a boxed object as list argument of callback', function () {
      var actual;

      reiterate.$.every('foo', function (item, index, list) {
        /*jslint unparam: true */
        /*jshint unused: false */
        actual = list;
      });

      expect(typeof actual).to.be('object');
      expect(required.toStringTag(actual)).to.be('[object String]');
      expect(String(actual)).to.be('foo');
      expect(actual.charAt(0)).to.be('f');
    });

    if (required.isStrictMode()) {
      it('does not autobox the content in strict mode', function () {
        var actual;

        reiterate.$.every([1], function () {
          actual = this;
        }, 'x');

        expect(typeof actual).to.be('string');

        reiterate.$.every([1], function () {
          actual = this;
        });

        expect(actual).to.be(undefined);

        reiterate.$.every([1], function () {
          actual = this;
        }, undefined);

        expect(actual).to.be(undefined);

        reiterate.$.every([1], function () {
          actual = this;
        }, null);

        expect(actual).to.be(null);
      });
    }
  });
}());

/*jslint sloppy: true */
(function () {
  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.every', function () {
    it('does autobox the content in non-strict mode', function () {
      var actual;

      reiterate.$.every([1], function () {
        actual = this;
      }, 'x');

      expect(typeof actual).to.be('object');

      reiterate.$.every([1], function () {
        actual = this;
      });

      expect(actual).to.be(required.global);

      reiterate.$.every([1], function () {
        actual = this;
      }, undefined);

      expect(actual).to.be(required.global);

      reiterate.$.every([1], function () {
        actual = this;
      }, null);

      expect(actual).to.be(required.global);
    });
  });
}());
