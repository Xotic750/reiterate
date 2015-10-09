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

  describe('Number.toInteger', function () {
    it('should throw a TypeError in each case', function () {
      expect(function () {
        reiterate.$.toInteger({
          toString: ''
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toInteger({
          toString: '1'
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toInteger({
          toString: 1
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toInteger({
          toString: 1.1
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      /*jshint -W047 */
      expect(function () {
        reiterate.$.toInteger({
          toString: 1.
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
      /*jshint +W047 */
    });

    it('argument missing, undefined and null', function () {
      expect(reiterate.$.toInteger()).to.be(0);
      expect(reiterate.$.toInteger(undefined)).to.be(0);
      expect(reiterate.$.toInteger(null)).to.be(0);
    });

    it('number', function () {
      expect(reiterate.$.toInteger(-10.123)).to.be(-10);
      expect(reiterate.$.toInteger(0)).to.be(0);
      expect(reiterate.$.toInteger(0.123)).to.be(0);
      expect(reiterate.$.toInteger(10)).to.be(10);
      expect(reiterate.$.toInteger(10.123)).to.be(10);
      expect(reiterate.$.toInteger(Infinity)).to.be(Infinity);
      expect(reiterate.$.toInteger(-Infinity)).to.be(-Infinity);
      expect(reiterate.$.toInteger(NaN)).to.be(0);
    });

    it('string', function () {
      expect(reiterate.$.toInteger('')).to.be(0);
      expect(reiterate.$.toInteger(' ')).to.be(0);
      expect(reiterate.$.toInteger('x')).to.be(0);
    });

    it('boolean', function () {
      expect(reiterate.$.toInteger(true)).to.be(1);
      expect(reiterate.$.toInteger(false)).to.be(0);
    });

    it('mixed objects', function () {
      expect(reiterate.$.toInteger({})).to.be(0);
      expect(reiterate.$.toInteger([])).to.be(0);
      expect(reiterate.$.toInteger([10.123])).to.be(10);
      expect(reiterate.$.toInteger(new RegExp('c'))).to.be(0);
      expect(reiterate.$.toInteger(new Error('x'))).to.be(0);
    });

    it('tens', function () {
      /*jshint -W047 */
      expect(reiterate.$.toInteger(10.)).to.be(10);
      /*jshint +W047 */
      expect(reiterate.$.toInteger(10.0)).to.be(10);
      expect(reiterate.$.toInteger('10.')).to.be(10);
      expect(reiterate.$.toInteger(' 10.')).to.be(10);
      expect(reiterate.$.toInteger('10. ')).to.be(10);
      expect(reiterate.$.toInteger(' 10. ')).to.be(10);
      expect(reiterate.$.toInteger('10.0')).to.be(10);
      expect(reiterate.$.toInteger(' 10.0')).to.be(10);
      expect(reiterate.$.toInteger('10.0 ')).to.be(10);
      expect(reiterate.$.toInteger(' 10.0 ')).to.be(10);
      expect(reiterate.$.toInteger('10.123')).to.be(10);
      expect(reiterate.$.toInteger(' 10.123')).to.be(10);
      expect(reiterate.$.toInteger('10.123 ')).to.be(10);
      expect(reiterate.$.toInteger(' 10.123 ')).to.be(10);
    });

    it('-1, 0, 1', function () {
      expect(reiterate.$.toInteger('-1')).to.be(-1);
      expect(reiterate.$.toInteger('0')).to.be(0);
      expect(reiterate.$.toInteger('1')).to.be(1);
      expect(reiterate.$.toInteger('-1.')).to.be(-1);
      expect(reiterate.$.toInteger('0.')).to.be(0);
      expect(reiterate.$.toInteger('1.')).to.be(1);
      /*jshint -W047 */
      expect(reiterate.$.toInteger(-1.)).to.be(-1);
      expect(reiterate.$.toInteger(0.)).to.be(0);
      expect(reiterate.$.toInteger(1.)).to.be(1);
      /*jshint +W047 */
      expect(reiterate.$.toInteger('-1.1')).to.be(-1);
      expect(reiterate.$.toInteger('0.1')).to.be(0);
      expect(reiterate.$.toInteger('1.1')).to.be(1);
    });

    it('date', function () {
      var dateInt;

      expect(function () {
        dateInt = reiterate.$.toInteger(new Date(2013, 11, 11));
      }).to.not.throwException();

      expect(typeof dateInt === 'number').to.be.ok();
      expect(reiterate.$.numIsNaN(dateInt)).to.not.be.ok();
    });

    it('string NaN, Infinity, -Infinity', function () {
      expect(reiterate.$.toInteger('NaN')).to.be(0);
      expect(reiterate.$.toInteger('Infinity')).to.be(Infinity);
      expect(reiterate.$.toInteger('-Infinity')).to.be(-Infinity);
    });

    it('array', function () {
      expect(reiterate.$.toInteger([])).to.be(0);
      expect(reiterate.$.toInteger([1])).to.be(1);
      expect(reiterate.$.toInteger([1.1])).to.be(1);
      /*jshint -W047 */
      expect(reiterate.$.toInteger([1.])).to.be(1);
      /*jshint +W047 */
      expect(reiterate.$.toInteger([''])).to.be(0);
      expect(reiterate.$.toInteger(['1'])).to.be(1);
      expect(reiterate.$.toInteger(['1.1'])).to.be(1);
    });

    it('object', function () {
      expect(reiterate.$.toInteger({})).to.be(0);
      expect(reiterate.$.toInteger({
        valueOf: ''
      })).to.be(0);
      expect(reiterate.$.toInteger({
        valueOf: '1'
      })).to.be(0);
      expect(reiterate.$.toInteger({
        valueOf: 1
      })).to.be(0);
      expect(reiterate.$.toInteger({
        valueOf: 1.1
      })).to.be(0);
      /*jshint -W047 */
      expect(reiterate.$.toInteger({
        valueOf: 1.
      })).to.be(0);
      /*jshint +W047 */
    });

    it('function', function () {
      expect(reiterate.$.toInteger(function () {
        return 1;
      })).to.be(0);
    });
  });
}());
