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

  describe('Array.indexOf', function () {
    var arr = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],
      arr2 = required.create(
        2,
        3,
        undefined,
        true,
        'hej',
        null,
        2,
        false,
        0,
        8,
        9
      ),
      arr3 = [0, 1, 2, 3, 4, 5];

    delete arr2[1];
    delete arr2[8];
    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.indexOf();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.indexOf(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.indexOf(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should find the string in array', function () {
      expect(reiterate.$.indexOf(arr, 'toString')).to.be(0);
      expect(reiterate.$.indexOf(arr, 'toLocaleString')).to.be(1);
      expect(reiterate.$.indexOf(arr, 'valueOf')).to.be(2);
      expect(reiterate.$.indexOf(arr, 'hasOwnProperty')).to.be(3);
      expect(reiterate.$.indexOf(arr, 'isPrototypeOf')).to.be(4);
      expect(reiterate.$.indexOf(arr, 'propertyIsEnumerable')).to.be(5);
      expect(reiterate.$.indexOf(arr, 'constructor')).to.be(6);
    });

    it('should not find the string in array', function () {
      expect(reiterate.$.indexOf(arr, 'foo')).to.be(-1);
      expect(reiterate.$.indexOf(arr, 'bar')).to.be(-1);
      expect(reiterate.$.indexOf(arr, 'fuz')).to.be(-1);
      expect(reiterate.$.indexOf(arr, 'push')).to.be(-1);
      expect(reiterate.$.indexOf(arr, 'pop')).to.be(-1);
    });

    it('should find the number in the array', function () {
      expect(reiterate.$.indexOf(arr3, 0)).to.be(0);
      expect(reiterate.$.indexOf(arr3, 1)).to.be(1);
      expect(reiterate.$.indexOf(arr3, 2)).to.be(2);
      expect(reiterate.$.indexOf(arr3, 3)).to.be(3);
      expect(reiterate.$.indexOf(arr3, 4)).to.be(4);
      expect(reiterate.$.indexOf(arr3, 5)).to.be(5);
    });

    it('should not find the number in the array', function () {
      expect(reiterate.$.indexOf(arr3, 6)).to.be(-1);
      expect(reiterate.$.indexOf(arr3, 7)).to.be(-1);
      expect(reiterate.$.indexOf(arr3, 8)).to.be(-1);
      expect(reiterate.$.indexOf(arr3, 9)).to.be(-1);
      expect(reiterate.$.indexOf(arr3, 10)).to.be(-1);
    });

    it('should find the element', function () {
      expect(reiterate.$.indexOf(arr2, 'hej')).to.be(4);
    });

    it('should not find the element', function () {
      expect(reiterate.$.indexOf(arr2, 'mus')).to.be(-1);
    });

    it('should find undefined as well', function () {
      expect(reiterate.$.indexOf(arr2, undefined)).to.not.be(-1);
    });

    it('should skip unset indexes', function () {
      expect(reiterate.$.indexOf(arr2, undefined)).to.be(2);
    });

    it('should use a strict test', function () {
      expect(reiterate.$.indexOf(arr2, null)).to.be(5);
      expect(reiterate.$.indexOf(arr2, '2')).to.be(-1);
    });

    it('should skip the first if fromIndex is set', function () {
      expect(reiterate.$.indexOf(arr2, 2, 2)).to.be(6);
      expect(reiterate.$.indexOf(arr2, 2, 0)).to.be(0);
      expect(reiterate.$.indexOf(arr2, 2, 6)).to.be(6);
    });

    it('should work with negative fromIndex', function () {
      expect(reiterate.$.indexOf(arr2, 2, -5)).to.be(6);
      expect(reiterate.$.indexOf(arr2, 2, -11)).to.be(0);
    });

    it('should work with fromIndex being greater than the length', function () {
      expect(reiterate.$.indexOf(arr2, 0, 20)).to.be(-1);
    });

    it(
      'should work with fromIndex being negative and greater than the length',
      function () {
        expect(reiterate.$.indexOf(arr2, 'hej', -20)).to.be(4);
      }
    );
  });
}());
