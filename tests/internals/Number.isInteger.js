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

  describe('Number.isInteger', function () {
    it('should be truthy on integers', function () {
      expect(reiterate.$.isInteger(4)).to.be.ok();
      expect(reiterate.$.isInteger(4.0)).to.be.ok();
      expect(reiterate.$.isInteger(reiterate.$.MAX_SAFE_INTEGER)).to.be.ok();
      expect(reiterate.$.isInteger(reiterate.$.MIN_SAFE_INTEGER)).to.be.ok();
    });

    it('should be falsy on non-integers', function () {
      var zero = 0;

      expect(reiterate.$.isInteger()).to.not.be.ok();
      expect(reiterate.$.isInteger(undefined)).to.not.be.ok();
      expect(reiterate.$.isInteger(null)).to.not.be.ok();
      expect(reiterate.$.isInteger(4.2)).to.not.be.ok();
      expect(reiterate.$.isInteger(Infinity)).to.not.be.ok();
      expect(reiterate.$.isInteger(-Infinity)).to.not.be.ok();
      expect(reiterate.$.isInteger(NaN)).to.not.be.ok();
      expect(reiterate.$.isInteger(true)).to.not.be.ok();
      expect(reiterate.$.isInteger(false)).to.not.be.ok();
      expect(reiterate.$.isInteger('str')).to.not.be.ok();
      expect(reiterate.$.isInteger('')).to.not.be.ok();
      expect(reiterate.$.isInteger({})).to.not.be.ok();

      expect(reiterate.$.isInteger(-10.123)).to.not.be.ok();
      expect(reiterate.$.isInteger(0)).to.be.ok();
      expect(reiterate.$.isInteger(0.123)).to.not.be.ok();
      expect(reiterate.$.isInteger(10)).to.be.ok();
      expect(reiterate.$.isInteger(10.123)).to.not.be.ok();
      expect(reiterate.$.isInteger([])).to.not.be.ok();
      expect(reiterate.$.isInteger([10.123])).to.not.be.ok();
      expect(reiterate.$.isInteger(new RegExp('c'))).to.not.be.ok();
      expect(reiterate.$.isInteger(new Error('x'))).to.not.be.ok();
      /*jshint -W047 */
      expect(reiterate.$.isInteger(10.)).to.be.ok();
      /*jshint +W047 */
      expect(reiterate.$.isInteger(10.0)).to.be.ok();
      expect(reiterate.$.isInteger('10.')).to.not.be.ok();
      expect(reiterate.$.isInteger(' 10.')).to.not.be.ok();
      expect(reiterate.$.isInteger('10. ')).to.not.be.ok();
      expect(reiterate.$.isInteger(' 10. ')).to.not.be.ok();
      expect(reiterate.$.isInteger('10.0')).to.not.be.ok();
      expect(reiterate.$.isInteger(' 10.0')).to.not.be.ok();
      expect(reiterate.$.isInteger('10.0 ')).to.not.be.ok();
      expect(reiterate.$.isInteger(' 10.0 ')).to.not.be.ok();
      expect(reiterate.$.isInteger('10.123')).to.not.be.ok();
      expect(reiterate.$.isInteger(' 10.123')).to.not.be.ok();
      expect(reiterate.$.isInteger('10.123 ')).to.not.be.ok();
      expect(reiterate.$.isInteger(' 10.123 ')).to.not.be.ok();

      expect(reiterate.$.isInteger('-1')).to.not.be.ok();
      expect(reiterate.$.isInteger('0')).to.not.be.ok();
      expect(reiterate.$.isInteger('1')).to.not.be.ok();
      expect(reiterate.$.isInteger('-1.')).to.not.be.ok();
      expect(reiterate.$.isInteger('0.')).to.not.be.ok();
      expect(reiterate.$.isInteger('1.')).to.not.be.ok();
      /*jshint -W047 */
      expect(reiterate.$.isInteger(-1.)).to.be.ok();
      expect(reiterate.$.isInteger(0.)).to.be.ok();
      expect(reiterate.$.isInteger(1.)).to.be.ok();
      /*jshint +W047 */
      expect(reiterate.$.isInteger(new Date(2013, 11, 11))).to.not.be.ok();
      expect(reiterate.$.isInteger(new Date(2013, 11, 11).getTime()))
        .to.be.ok();
      expect(reiterate.$.isInteger('NaN')).to.not.be.ok();
      expect(reiterate.$.isInteger('Infinity')).to.not.be.ok();
      expect(reiterate.$.isInteger('-Infinity')).to.not.be.ok();
      expect(reiterate.$.isInteger([])).to.not.be.ok();
      expect(reiterate.$.isInteger([1])).to.not.be.ok();
      expect(reiterate.$.isInteger([1.1])).to.not.be.ok();

      expect(reiterate.$.isInteger({
        valueOf: function () {
          return 3;
        }
      })).to.not.be.ok();

      expect(reiterate.$.isInteger({
        valueOf: function () {
          return zero / zero;
        }
      })).to.not.be.ok();

      expect(reiterate.$.isInteger({
        valueOf: function () {
          throw 17;
        }
      })).to.not.be.ok();

      expect(reiterate.$.isInteger({
        toString: function () {
          throw 17;
        }
      })).to.not.be.ok();

      expect(reiterate.$.isInteger({
        valueOf: function () {
          throw 17;
        },
        toString: function () {
          throw 42;
        }
      })).to.not.be.ok();
    });

    it('should be false when the type is not number', function () {
      var nonNumbers = [
        false,
        true,
        null,
        undefined,
        '',
        reiterate.$.noop, {
          valueOf: function () {
            return 3;
          }
        },
        new RegExp('a', 'g'), {}
      ];

      reiterate.$.forEach(nonNumbers, function (thing) {
        expect(reiterate.$.isInteger(thing)).to.not.be.ok();
      });
    });

    it('should be false when NaN', function () {
      expect(reiterate.$.isInteger(NaN)).to.not.be.ok();
    });

    it('should be false when Infinity', function () {
      expect(reiterate.$.isInteger(Infinity)).to.not.be.ok();
      expect(reiterate.$.isInteger(-Infinity)).to.not.be.ok();
    });

    it('should be false when number is not integer', function () {
      expect(reiterate.$.isInteger(3.4)).to.not.be.ok();
      expect(reiterate.$.isInteger(-3.4)).to.not.be.ok();
    });

    it('should be true when abs(number) is 2^53 or larger', function () {
      expect(reiterate.$.isInteger(Math.pow(2, 53))).to.be.ok();
      expect(reiterate.$.isInteger(-Math.pow(2, 53))).to.be.ok();
    });

    it('should be true when abs(number) is less than 2^53', function () {
      var safeIntegers = [0, 1, Math.pow(2, 53) - 1];

      reiterate.$.forEach(safeIntegers, function (safeInt) {
        expect(reiterate.$.isInteger(safeInt)).to.be.ok();
        expect(reiterate.$.isInteger(-safeInt)).to.be.ok();
      });
    });
  });
}());
