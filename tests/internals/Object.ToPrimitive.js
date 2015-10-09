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

  describe('Object.toPrimitive', function () {
    it('should throw a TypeError in each case', function () {
      expect(function () {
        reiterate.$.toPrimitive({
          toString: ''
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toPrimitive({
          toString: '1'
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toPrimitive({
          toString: 1
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toPrimitive({
          toString: 1.1
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      /*jshint -W047 */
      expect(function () {
        reiterate.$.toPrimitive({
          toString: 1.
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
      /*jshint +W047 */
    });

    it('argument missing, undefined and null', function () {
      expect(reiterate.$.toPrimitive()).to.be(undefined);
      expect(reiterate.$.toPrimitive(undefined)).to.be(undefined);
      expect(reiterate.$.toPrimitive(null)).to.be(null);
    });

    it('number', function () {
      expect(reiterate.$.toPrimitive(-10.123)).to.be(-10.123);
      expect(reiterate.$.toPrimitive(0)).to.be(0);
      expect(reiterate.$.toPrimitive(0.123)).to.be(0.123);
      expect(reiterate.$.toPrimitive(10)).to.be(10);
      expect(reiterate.$.toPrimitive(10.123)).to.be(10.123);
      expect(reiterate.$.toPrimitive(Infinity)).to.be(Infinity);
      expect(reiterate.$.toPrimitive(-Infinity)).to.be(-Infinity);
      expect(reiterate.$.numIsNaN(reiterate.$.toPrimitive(NaN))).to.be.ok();
    });

    it('string', function () {
      expect(reiterate.$.toPrimitive('')).to.be('');
      expect(reiterate.$.toPrimitive(' ')).to.be(' ');
      expect(reiterate.$.toPrimitive('x')).to.be('x');
    });

    it('boolean', function () {
      expect(reiterate.$.toPrimitive(true)).to.be(true);
      expect(reiterate.$.toPrimitive(false)).to.be(false);
    });

    it('mixed objects', function () {
      expect(reiterate.$.toPrimitive({})).to.be.ok();
      expect(reiterate.$.toPrimitive([])).to.be('');
      expect(reiterate.$.toPrimitive([10.123])).to.be('10.123');
      expect(reiterate.$.toPrimitive(new RegExp('c'))).to.be(new RegExp('c')
        .toString());
      expect(reiterate.$.toPrimitive(new Error('x')))
        .to.be(new Error('x').toString());
      expect(reiterate.$.toPrimitive(new Date(123456789)))
        .to.be(new Date(123456789).toString());
      expect(reiterate.$.toPrimitive(new Date(123456789), 'number'))
      .to.be(123456789);
    });

    it('tens', function () {
      /*jshint -W047 */
      expect(reiterate.$.toPrimitive(10.)).to.be(10);
      /*jshint +W047 */
      expect(reiterate.$.toPrimitive(10.0)).to.be(10);
      expect(reiterate.$.toPrimitive('10.')).to.be('10.');
      expect(reiterate.$.toPrimitive(' 10.')).to.be(' 10.');
      expect(reiterate.$.toPrimitive('10. ')).to.be('10. ');
      expect(reiterate.$.toPrimitive(' 10. ')).to.be(' 10. ');
      expect(reiterate.$.toPrimitive('10.0')).to.be('10.0');
      expect(reiterate.$.toPrimitive(' 10.0')).to.be(' 10.0');
      expect(reiterate.$.toPrimitive('10.0 ')).to.be('10.0 ');
      expect(reiterate.$.toPrimitive(' 10.0 ')).to.be(' 10.0 ');
      expect(reiterate.$.toPrimitive('10.123')).to.be('10.123');
      expect(reiterate.$.toPrimitive(' 10.123')).to.be(' 10.123');
      expect(reiterate.$.toPrimitive('10.123 ')).to.be('10.123 ');
      expect(reiterate.$.toPrimitive(' 10.123 ')).to.be(' 10.123 ');
    });

    it('-1, 0, 1', function () {
      expect(reiterate.$.toPrimitive('-1')).to.be('-1');
      expect(reiterate.$.toPrimitive('0')).to.be('0');
      expect(reiterate.$.toPrimitive('1')).to.be('1');
      expect(reiterate.$.toPrimitive('-1.')).to.be('-1.');
      expect(reiterate.$.toPrimitive('0.')).to.be('0.');
      expect(reiterate.$.toPrimitive('1.')).to.be('1.');
      /*jshint -W047 */
      expect(reiterate.$.toPrimitive(-1.)).to.be(-1);
      expect(reiterate.$.toPrimitive(0.)).to.be(0);
      expect(reiterate.$.toPrimitive(1.)).to.be(1);
      /*jshint +W047 */
      expect(reiterate.$.toPrimitive('-1.1')).to.be('-1.1');
      expect(reiterate.$.toPrimitive('0.1')).to.be('0.1');
      expect(reiterate.$.toPrimitive('1.1')).to.be('1.1');
    });

    it('date', function () {
      var date;

      expect(function () {
        date = reiterate.$.toPrimitive(new Date(2013, 11, 11));
      }).to.not.throwException();

      expect(typeof date === 'string').to.be.ok();
      expect(date).to.be(new Date(2013, 11, 11).toString());

      expect(function () {
        date = reiterate.$.toPrimitive(new Date(2013, 11, 11), 'number');
      }).to.not.throwException();

      expect(typeof date === 'number').to.be.ok();
      expect(date).to.be(new Date(2013, 11, 11).valueOf());
    });

    it('string NaN, Infinity, -Infinity', function () {
      expect(reiterate.$.toPrimitive('NaN')).to.be('NaN');
      expect(reiterate.$.toPrimitive('Infinity')).to.be('Infinity');
      expect(reiterate.$.toPrimitive('-Infinity')).to.be('-Infinity');
    });

    it('array', function () {
      expect(reiterate.$.toPrimitive([])).to.be('');
      expect(reiterate.$.toPrimitive([1])).to.be('1');
      expect(reiterate.$.toPrimitive([1.1])).to.be('1.1');
      /*jshint -W047 */
      expect(reiterate.$.toPrimitive([1.])).to.be('1');
      /*jshint +W047 */
      expect(reiterate.$.toPrimitive([''])).to.be('');
      expect(reiterate.$.toPrimitive(['1', '2'])).to.be('1,2');
      expect(reiterate.$.toPrimitive(['1.1'])).to.be('1.1');
    });

    it('object', function () {
      expect(reiterate.$.toPrimitive({})).to.be('[object Object]');
      expect(reiterate.$.toPrimitive({
        valueOf: ''
      })).to.be('[object Object]');
      expect(reiterate.$.toPrimitive({
        valueOf: '1'
      })).to.be('[object Object]');
      expect(reiterate.$.toPrimitive({
        valueOf: 1
      })).to.be('[object Object]');
      expect(reiterate.$.toPrimitive({
        valueOf: 1.1
      })).to.be('[object Object]');
      /*jshint -W047 */
      expect(reiterate.$.toPrimitive({
        valueOf: 1.
      })).to.be('[object Object]');
      /*jshint +W047 */
    });

    it('function', function () {
      var fn = function () {
        return 1;
      };

      expect(reiterate.$.toPrimitive(fn)).to.be(fn.toString());
    });
  });
}());
