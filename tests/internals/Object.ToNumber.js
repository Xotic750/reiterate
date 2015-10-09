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

  describe('Object.toNumber', function () {
    it('should throw a TypeError in each case', function () {
      expect(function () {
        reiterate.$.toNumber({
          toString: ''
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toNumber({
          toString: '1'
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toNumber({
          toString: 1
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toNumber({
          toString: 1.1
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      /*jshint -W047 */
      expect(function () {
        reiterate.$.toNumber({
          toString: 1.
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
      /*jshint +W047 */
    });

    it('argument missing, undefined and null', function () {
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber())).to.be.ok();
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber(undefined))).to.be.ok();
      expect(reiterate.$.toNumber(null)).to.be(0);
    });

    it('number', function () {
      expect(reiterate.$.toNumber(-10.123)).to.be(-10.123);
      expect(reiterate.$.toNumber(0)).to.be(0);
      expect(reiterate.$.toNumber(0.123)).to.be(0.123);
      expect(reiterate.$.toNumber(10)).to.be(10);
      expect(reiterate.$.toNumber(10.123)).to.be(10.123);
      expect(reiterate.$.toNumber(Infinity)).to.be(Infinity);
      expect(reiterate.$.toNumber(-Infinity)).to.be(-Infinity);
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber(NaN))).to.be.ok();
    });

    it('string', function () {
      expect(reiterate.$.toNumber('')).to.be(0);
      expect(reiterate.$.toNumber(' ')).to.be(0);
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber('x'))).to.be.ok();
    });

    it('boolean', function () {
      expect(reiterate.$.toNumber(true)).to.be(1);
      expect(reiterate.$.toNumber(false)).to.be(0);
    });

    it('mixed objects', function () {
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber({}))).to.be.ok();
      expect(reiterate.$.toNumber([])).to.be(0);
      expect(reiterate.$.toNumber([10.123])).to.be(10.123);
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber(new RegExp('c')))).to.be.ok();
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber(new Error('x')))).to.be.ok();
      expect(reiterate.$.toNumber(new Date(123456789))).to.be(123456789);
    });

    it('tens', function () {
      /*jshint -W047 */
      expect(reiterate.$.toNumber(10.)).to.be(10);
      /*jshint +W047 */
      expect(reiterate.$.toNumber(10.0)).to.be(10);
      expect(reiterate.$.toNumber('10.')).to.be(10);
      expect(reiterate.$.toNumber(' 10.')).to.be(10);
      expect(reiterate.$.toNumber('10. ')).to.be(10);
      expect(reiterate.$.toNumber(' 10. ')).to.be(10);
      expect(reiterate.$.toNumber('10.0')).to.be(10);
      expect(reiterate.$.toNumber(' 10.0')).to.be(10);
      expect(reiterate.$.toNumber('10.0 ')).to.be(10);
      expect(reiterate.$.toNumber(' 10.0 ')).to.be(10);
      expect(reiterate.$.toNumber('10.123')).to.be(10.123);
      expect(reiterate.$.toNumber(' 10.123')).to.be(10.123);
      expect(reiterate.$.toNumber('10.123 ')).to.be(10.123);
      expect(reiterate.$.toNumber(' 10.123 ')).to.be(10.123);
    });

    it('-1, 0, 1', function () {
      expect(reiterate.$.toNumber('-1')).to.be(-1);
      expect(reiterate.$.toNumber('0')).to.be(0);
      expect(reiterate.$.toNumber('1')).to.be(1);
      expect(reiterate.$.toNumber('-1.')).to.be(-1);
      expect(reiterate.$.toNumber('0.')).to.be(0);
      expect(reiterate.$.toNumber('1.')).to.be(1);
      /*jshint -W047 */
      expect(reiterate.$.toNumber(-1.)).to.be(-1);
      expect(reiterate.$.toNumber(0.)).to.be(0);
      expect(reiterate.$.toNumber(1.)).to.be(1);
      /*jshint +W047 */
      expect(reiterate.$.toNumber('-1.1')).to.be(-1.1);
      expect(reiterate.$.toNumber('0.1')).to.be(0.1);
      expect(reiterate.$.toNumber('1.1')).to.be(1.1);
    });

    it('date', function () {
      var dateInt;

      expect(function () {
        dateInt = reiterate.$.toNumber(new Date(2013, 11, 11));
      }).to.not.throwException();

      expect(typeof dateInt === 'number').to.be.ok();
      expect(reiterate.$.numIsNaN(dateInt)).to.not.be.ok();
    });

    it('string NaN, Infinity, -Infinity', function () {
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber('NaN'))).to.be.ok();
      expect(reiterate.$.toNumber('Infinity')).to.be(Infinity);
      expect(reiterate.$.toNumber('-Infinity')).to.be(-Infinity);
    });

    it('array', function () {
      expect(reiterate.$.toNumber([])).to.be(0);
      expect(reiterate.$.toNumber([1])).to.be(1);
      expect(reiterate.$.toNumber([1.1])).to.be(1.1);
      /*jshint -W047 */
      expect(reiterate.$.toNumber([1.])).to.be(1);
      /*jshint +W047 */
      expect(reiterate.$.toNumber([''])).to.be(0);
      expect(reiterate.$.toNumber(['1'])).to.be(1);
      expect(reiterate.$.toNumber(['1.1'])).to.be(1.1);
    });

    it('object', function () {
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber({}))).to.be.ok();
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber({
        valueOf: ''
      }))).to.be.ok();
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber({
        valueOf: '1'
      }))).to.be.ok();
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber({
        valueOf: 1
      }))).to.be.ok();
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber({
        valueOf: 1.1
      }))).to.be.ok();
      /*jshint -W047 */
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber({
        valueOf: 1.
      }))).to.be.ok();
      /*jshint +W047 */
    });

    it('function', function () {
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber(function () {
        return 1;
      }))).to.be.ok();
    });
  });
}());
