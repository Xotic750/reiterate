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

  describe('Array.map', function () {
    var lastIndex = Math.pow(2, 32) - 1,
      mapArray = required.create(
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
      callback;

    mapArray.length = 25;
    mapArray[24] = NaN;
    mapArray[25] = 'end';

    beforeEach(function () {
      var i = -1;

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
      callback = function () {
        i += 1;

        return i;
      };
    });

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.map();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.map(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.map(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if function argument is not a function', function () {
      expect(function () {
        reiterate.$.map(mapArray);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.map(mapArray, undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.map(mapArray, null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should not throw an error in each case', function () {
      expect(reiterate.$.map(mapArray, function (element, index, array) {
        expect(array).to.be(mapArray);
        expect(typeof index === 'number').to.be.ok();
        expect(index >= 0).to.be.ok();
        expect(index <= lastIndex).to.be.ok();
        if (reiterate.$.numIsNaN(element)) {
          expect(reiterate.$.numIsNaN(mapArray[index])).to.be(true);
        } else {
          expect(element).to.be(mapArray[index]);
        }

        testIndex = index;

        return element;
      }).toString()).to.be(mapArray.toString());

      expect(testIndex).to.be(mapArray.length - 1);
    });

    it('should pass the right parameters', function () {
      var array = ['1'];

      reiterate.$.map(array, function (item, index, list) {
        expect(item).to.be('1');
        expect(index).to.be(0);
        expect(list).to.be(array);
      });
    });

    it('should set the context correctly', function () {
      var context = {};

      reiterate.$.map(testSubject, function (o, i) {
        this[i] = o;
      }, context);

      expect(context).to.eql(testSubject);
    });

    it('should set the right context when given none', function () {
      var context;

      reiterate.$.map([1], function () {
        context = this;
      });

      expect(context).to.be((function () {
        return function () {
          return this;
        };
      }()).call());
    });

    it('should not change the array it is called on', function () {
      var copy = reiterate.$.chop(testSubject);

      reiterate.$.map(testSubject, callback);
      expect(testSubject).to.eql(copy);
    });

    it(
      'should only run for the number of objects in the array when it started',
      function () {
        var arr1 = [1, 2, 3, 4, 5],
          arr2 = [1, 2, 3, 4, 5, 4, 5, 6, 8],
          i = 0;

        delete arr1[3];
        delete arr2[3];
        reiterate.$.map(arr1, function (o) {
          arr1.push(o + 3);
          i += 1;

          return o;
        });

        expect(arr1).to.eql(arr2);
        expect(i).to.be(4);
      }
    );

    it(
      'should properly translate the values as according to the callback',
      function () {
        var result = reiterate.$.map(testSubject, callback),
          expected = [0, 0, 1, 2, 3, 4, 5, 6, 'a', 7];

        delete expected[1];
        delete expected[8];
        expect(result).to.eql(expected);
      }
    );

    it('should skip non-existing values', function () {
      var array = [1, 2, 3, 4, 5, 6],
        i = 0;

      delete array[2];
      delete array[5];
      reiterate.$.map(array, function () {
        i += 1;
      });

      expect(i).to.be(4);
    });

    it('should have a boxed object as list argument of callback', function () {
      var actual;

      reiterate.$.map('foo', function (item, index, list) {
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
      it('does not autobox the content in strict mode', function () {
        var actual;

        reiterate.$.map([1], function () {
          actual = this;
        }, 'x');

        expect(typeof actual).to.be('string');

        reiterate.$.map([1], function () {
          actual = this;
        });

        expect(actual).to.be(undefined);

        reiterate.$.map([1], function () {
          actual = this;
        }, undefined);

        expect(actual).to.be(undefined);

        reiterate.$.map([1], function () {
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

  describe('Array.map', function () {
    it('does autobox the content in non-strict mode', function () {
      var actual;

      reiterate.$.map([1], function () {
        actual = this;
      }, 'x');

      expect(typeof actual).to.be('object');

      reiterate.$.map([1], function () {
        actual = this;
      });

      expect(actual).to.be(required.global);

      reiterate.$.map([1], function () {
        actual = this;
      }, undefined);

      expect(actual).to.be(required.global);

      reiterate.$.map([1], function () {
        actual = this;
      }, null);

      expect(actual).to.be(required.global);
    });
  });
}());
