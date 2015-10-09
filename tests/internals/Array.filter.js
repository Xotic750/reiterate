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

  describe('Array.filter', function () {
    var lastIndex = Math.pow(2, 32) - 1,
      filterArray = required.create(
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
      filteredArray,
      callback;

    filterArray.length = 25;
    filterArray[24] = NaN;
    filterArray[25] = 'end';

    callback = function callback(o, i) {
      /*jslint unparam: true */
      /*jshint unused: false */
      return i !== 3 && i !== 5;
    };

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
      filteredArray = required.create(2, undefined, 'hej', false, 0, 9);
    });

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.filter();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.filter(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.filter(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if function argument is not a function', function () {
      expect(function () {
        reiterate.$.filter(filterArray);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.filter(filterArray, undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.filter(filterArray, null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should not throw an error in each case', function () {
      expect(reiterate.$.filter(
        filterArray,
        function (element, index, array) {
          expect(array).to.be(filterArray);
          expect(typeof index === 'number').to.be.ok();
          expect(index >= 0).to.be.ok();
          expect(index <= lastIndex).to.be.ok();
          if (reiterate.$.numIsNaN(element)) {
            expect(reiterate.$.numIsNaN(filterArray[index])).to.be.ok();
          } else {
            expect(element).to.be(filterArray[index]);
          }

          testIndex = index;
          if (reiterate.$.isString(element)) {
            return element;
          }

          return undefined;
        }
      ).toString()).to.be(['a', 'b', 'c', 'end'].toString());

      expect(testIndex).to.be(filterArray.length - 1);
    });

    it('should pass the right parameters', function () {
      var array = ['1'];

      reiterate.$.filter(array, function (item, index, list) {
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

        reiterate.$.filter(arr, function (a) {
          i += 1;
          if (i <= 4) {
            arr.push(a + 3);
          }

          return true;
        });

        expect(arr).to.eql([1, 2, 3, 4, 5, 6]);
        expect(i).to.be(3);
      }
    );

    it('should skip non-set values', function () {
      var passedValues = {},
        expected = {
          0: 1,
          2: 3,
          3: 4
        };

      testSubject = [1, 2, 3, 4];
      delete testSubject[1];
      reiterate.$.filter(testSubject, function (o, i) {
        passedValues[i] = o;

        return true;
      });

      expect(passedValues).to.eql(expected);
    });

    it('should pass the right context to the filter', function () {
      var passedValues = {},
        expected = {
          0: 1,
          2: 3,
          3: 4
        };

      testSubject = [1, 2, 3, 4];
      delete testSubject[1];
      reiterate.$.filter(testSubject, function (o, i) {
        this[i] = o;

        return true;
      }, passedValues);

      expect(passedValues).to.eql(expected);
    });

    it('should set the right context when given none', function () {
      var context;

      reiterate.$.filter([1], function () {
        context = this;
      });

      expect(context).to.be((function () {
        return function () {
          return this;
        };
      }()).call());
    });

    it(
      'should remove only the values for which the callback returns false',
      function () {
        expect(reiterate.$.filter(testSubject, callback)).to.eql(filteredArray);
      }
    );

    it('should leave the original array untouched', function () {
      var copy = reiterate.$.chop(testSubject);

      reiterate.$.filter(testSubject, callback);
      expect(testSubject).to.eql(copy);
    });

    it('should have a boxed object as list argument of callback', function () {
      var actual;

      reiterate.$.filter('foo', function (item, index, list) {
        /*jslint unparam: true */
        /*jshint unused: false */
        actual = list;
      });

      expect(typeof actual).to.be('object');
      expect(required.toStringTag(actual)).to.be('[object String]');
      expect(String(actual)).to.be('foo');
      expect(actual.charAt(0)).to.be('f');
    });

    it('should not be affected by same-index mutation', function () {
      var results = reiterate.$.filter(
        [1, 2, 3],
        function (value, index, array) {
          /*jslint unparam: true */
          /*jshint unused: false */
          array[index] = 'a';

          return true;
        }
      );

      expect(results).to.eql([1, 2, 3]);
    });

    if (required.isStrictMode()) {
      it('does not autobox the content in strict mode', function () {
        var actual;

        reiterate.$.filter([1], function () {
          actual = this;
        }, 'x');

        expect(typeof actual).to.be('string');

        reiterate.$.filter([1], function () {
          actual = this;
        });

        expect(actual).to.be(undefined);

        reiterate.$.filter([1], function () {
          actual = this;
        }, undefined);

        expect(actual).to.be(undefined);

        reiterate.$.filter([1], function () {
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

  describe('Array.filter', function () {
    it('does autobox the content in non-strict mode', function () {
      var actual;

      reiterate.$.filter([1], function () {
        actual = this;
      }, 'x');

      expect(typeof actual).to.be('object');

      reiterate.$.filter([1], function () {
        actual = this;
      });

      expect(actual).to.be(required.global);

      reiterate.$.filter([1], function () {
        actual = this;
      }, undefined);

      expect(actual).to.be(required.global);

      reiterate.$.filter([1], function () {
        actual = this;
      }, null);

      expect(actual).to.be(required.global);
    });
  });
}());
