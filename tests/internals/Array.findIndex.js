/*jslint maxlen:80, es6:false, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.findIndex', function () {
    var list = [5, 10, 15, 20];

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.findIndex();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.findIndex(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.findIndex(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if function argument is not a function', function () {
      expect(function () {
        reiterate.$.findIndex(list);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.findIndex(list, undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.findIndex(list, null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should find item key by predicate', function () {
      var result = reiterate.$.findIndex(list, function (item) {
        return item === 15;
      });

      expect(result).to.be(2);
    });

    it('should return -1 when nothing matched', function () {
      var result = reiterate.$.findIndex(list, function (item) {
        return item === 'a';
      });

      expect(result).to.be(-1);
    });

    it('should receive all three parameters', function () {
      var index = reiterate.$.findIndex(list, function (value, index, arr) {
        expect(list[index]).to.be(value);
        expect(list).to.eql(arr);

        return false;
      });

      expect(index).to.be(-1);
    });

    it('should work with the context argument', function () {
      var context = {};

      reiterate.$.findIndex([1], function () {
        expect(this).to.be(context);
      }, context);
    });

    it('should work with an array-like object', function () {
      var obj = {
          0: 1,
          1: 2,
          2: 3,
          length: 3
        },
        foundIndex = reiterate.$.findIndex(obj, function (item) {
          return item === 3;
        });

      expect(foundIndex).to.be(2);
    });

    it(
      'should work with an array-like object with negative length',
      function () {
        var obj = {
            0: 1,
            1: 2,
            2: 3,
            length: -3
          },
          foundIndex = reiterate.$.findIndex(obj, function () {
            throw new Error('should not reach here');
          });

        expect(foundIndex).to.be(-1);
      }
    );

    it('should work with a sparse array', function () {
      var obj = required.create(1, 2, undefined),
        seen = [],
        foundIndex,
        expected = [];

      seen.length = 3;
      delete obj[1];
      foundIndex = reiterate.$.findIndex(obj, function (item, idx) {
        if (Object.prototype.hasOwnProperty.call(obj, idx)) {
          seen[idx] = required.create(idx, item);

          return reiterate.$.isUndefined(item);
        }

        return false;
      });

      expected.length = 3;
      expected[0] = [0, 1];
      expected[2] = required.create(2, undefined);
      expect(foundIndex).to.be(2);
      expect(seen).to.eql(expected);
    });

    it('should work with a sparse array-like object', function () {
      var obj = {
          0: 1,
          2: undefined,
          length: 3.2
        },
        seen = [],
        expected = [],
        foundIndex;

      seen.length = 3;
      foundIndex = reiterate.$.findIndex(obj, function (item, idx) {
        if (Object.prototype.hasOwnProperty.call(obj, idx)) {
          seen[idx] = required.create(idx, item);

          return reiterate.$.isUndefined(item);
        }

        return false;
      });

      expected.length = 3;
      expected[0] = [0, 1];
      expected[2] = required.create(2, undefined);
      expect(foundIndex).to.be(2);
      expect(seen).to.eql(expected);
    });

    if (required.isStrictMode()) {
      it('does not autobox the content in strict mode', function () {
        var actual;

        reiterate.$.findIndex([1], function () {
          actual = this;
        }, 'x');

        expect(typeof actual).to.be('string');

        reiterate.$.findIndex([1], function () {
          actual = this;
        });

        expect(actual).to.be(undefined);

        reiterate.$.findIndex([1], function () {
          actual = this;
        }, undefined);

        expect(actual).to.be(undefined);

        reiterate.$.findIndex([1], function () {
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

  describe('Array.findIndex', function () {
    it('does autobox the content in non-strict mode', function () {
      var actual;

      reiterate.$.findIndex([1], function () {
        actual = this;
      }, 'x');

      expect(typeof actual).to.be('object');

      reiterate.$.findIndex([1], function () {
        actual = this;
      });

      expect(actual).to.be(required.global);

      reiterate.$.findIndex([1], function () {
        actual = this;
      }, undefined);

      expect(actual).to.be(required.global);

      reiterate.$.findIndex([1], function () {
        actual = this;
      }, null);

      expect(actual).to.be(required.global);
    });
  });
}());
