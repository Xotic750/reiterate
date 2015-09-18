/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:3, maxdepth:4, maxstatements:200,
    maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Initialise', function () {
      expect(function () {
        reiterate();
        reiterate(undefined);
        reiterate(null);
        reiterate(0);
        reiterate(false);
        reiterate('');
        reiterate([]);
        reiterate({});
      }).to.not.throwException();
    });

    it('Counter simple', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate()) {
        expect(entry).to.eql(index);
        index += 1;
        if (index === 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(undefined)) {
        expect(entry).to.be(index);
        index += 1;
        if (index === 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(null)) {
        expect(entry).to.be(index);
        index += 1;
        if (index === 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(9)) {
        expect(entry).to.be(index);
        index += 1;
      }

      // reverse
      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate().reverse()) {
        expect(entry).to.be(index);
        index -= 1;
        if (index === Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate(undefined).reverse()) {
        expect(entry).to.be(index);
        index -= 1;
        if (index === Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate(null).reverse()) {
        expect(entry).to.be(index);
        index -= 1;
        if (index === Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = -9;
      for (entry of reiterate(-9).reverse()) {
        expect(entry).to.be(index);
        index += 1;
      }
    });

    it('Counter specific arguments', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate(0, 10)) {
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate(-10, 0)) {
        expect(entry).to.be(index);
        index += 1;
      }

      index = 10;
      for (entry of reiterate(10, -20)) {
        expect(entry).to.be(index);
        index -= 1;
      }

      index = -20;
      for (entry of reiterate(-20, -10)) {
        expect(entry).to.be(index);
        index += 1;
      }

      // reverse
      index = 10;
      for (entry of reiterate(0, 10).reverse()) {
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate(10, 0).reverse()) {
        expect(entry).to.be(index);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(-10, 0).reverse()) {
        expect(entry).to.be(index);
        index -= 1;
      }

      index = -10;
      for (entry of reiterate(0, -10).reverse()) {
        expect(entry).to.be(index);
        index += 1;
      }
    });

    it('Counter with step', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate(0, 10, 1)) {
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate(-10, 0, 2)) {
        expect(entry).to.be(index);
        index += 2;
      }

      index = 10;
      for (entry of reiterate(10, -20, 3)) {
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -20;
      for (entry of reiterate(-20, -10, -2)) {
        expect(entry).to.be(index);
        index += 2;
      }

      // reverse
      index = 10;
      for (entry of reiterate(0, 10, 1).reverse()) {
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate(10, 0, 2).reverse()) {
        expect(entry).to.be(index);
        index += 2;
      }

      index = 0;
      for (entry of reiterate(-10, 0, 3).reverse()) {
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -10;
      for (entry of reiterate(0, -10, -2).reverse()) {
        expect(entry).to.be(index);
        index += 2;
      }
    });

    it('Counter zeros', function () {
      var index = 0,
        entry;

      index = 0;
      for (entry of reiterate(0)) {
        expect(entry).to.eql(index);
        if (index !== 0) {
          expect(0).to.eql(index);
        }

        index += 1;
      }

      index = 0;
      for (entry of reiterate(0, 0)) {
        expect(entry).to.eql(index);
        if (index !== 0) {
          expect(0).to.eql(index);
        }

        index += 1;
      }

      index = 0;
      expect(function () {
        reiterate(0, 10, 0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });









    it('Counter simple sugar', function () {
      var index = 10,
        entry;

      // forward
      for (entry of reiterate().from(10)) {
        expect(entry).to.eql(index);
        index += 1;
        if (index === 20) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(undefined).to(10)) {
        expect(entry).to.be(index);
        if (index > 10) {
          expect(10).to.eql(index);
        }

        index += 1;
      }

      index = 0;
      for (entry of reiterate(null).by(2)) {
        expect(entry).to.be(index);
        index += 2;
        if (index > 10) {
          break;
        }
      }

      index = 10;
      for (entry of reiterate().from(10).to(20).by(2)) {
        expect(entry).to.be(index);
        if (index > 20) {
          expect(20).to.be(index);
        }

        index += 2;
      }

      // reverse
      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate().from(10).reverse()) {
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = 10;
      for (entry of reiterate(undefined).to(10).reverse()) {
        expect(entry).to.be(index);
        if (index < 0) {
          expect(Number.MAX_SAFE_INTEGER).to.be(index);
        }

        index -= 1;
      }

      index = 10;
      for (entry of reiterate().from(0).to(10).reverse()) {
        expect(entry).to.be(index);
        if (index < 0) {
          expect(0).to.be(index);
        }

        index -= 1;
      }

      index = 0;
      for (entry of reiterate().from(-10).to(0).by(-2).reverse()) {
        expect(entry).to.be(index);
        if (index < -10) {
          expect(-10).to.be(index);
        }

        index -= 2;
      }
    });

    it('Counter specific arguments', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate(0, 10)) {
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate(-10, 0)) {
        expect(entry).to.be(index);
        index += 1;
      }

      index = 10;
      for (entry of reiterate(10, -20)) {
        expect(entry).to.be(index);
        index -= 1;
      }

      index = -20;
      for (entry of reiterate(-20, -10)) {
        expect(entry).to.be(index);
        index += 1;
      }

      // reverse
      index = 10;
      for (entry of reiterate(0, 10).reverse()) {
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate(10, 0).reverse()) {
        expect(entry).to.be(index);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(-10, 0).reverse()) {
        expect(entry).to.be(index);
        index -= 1;
      }

      index = -10;
      for (entry of reiterate(0, -10).reverse()) {
        expect(entry).to.be(index);
        index += 1;
      }
    });

    it('Counter with step', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate(0, 10, 1)) {
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate(-10, 0, 2)) {
        expect(entry).to.be(index);
        index += 2;
      }

      index = 10;
      for (entry of reiterate(10, -20, 3)) {
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -20;
      for (entry of reiterate(-20, -10, -2)) {
        expect(entry).to.be(index);
        index += 2;
      }

      // reverse
      index = 10;
      for (entry of reiterate(0, 10, 1).reverse()) {
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate(10, 0, 2).reverse()) {
        expect(entry).to.be(index);
        index += 2;
      }

      index = 0;
      for (entry of reiterate(-10, 0, 3).reverse()) {
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -10;
      for (entry of reiterate(0, -10, -2).reverse()) {
        expect(entry).to.be(index);
        index += 2;
      }
    });

    it('Counter zeros', function () {
      var index = 0,
        entry;

      index = 0;
      for (entry of reiterate(0)) {
        expect(entry).to.eql(index);
        if (index !== 0) {
          expect(0).to.eql(index);
        }

        index += 1;
      }

      index = 0;
      for (entry of reiterate(0, 0)) {
        expect(entry).to.eql(index);
        if (index !== 0) {
          expect(0).to.eql(index);
        }

        index += 1;
      }

      index = 0;
      expect(function () {
        reiterate(0, 10, 0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });








    it('Array of primatives', function () {
      var a = [1, 2, 3, 5, 1, 3, 1, 2, 4],
        index = 0,
        entry;

      // forward
      for (entry of reiterate(a)) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a).entries()) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a).values()) {
        expect(entry).to.be(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a).keys()) {
        expect(entry).to.eql(index);
        index += 1;
      }

      // reverse
      index = a.length - 1;
      for (entry of reiterate(a).reverse()) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a).entries().reverse()) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a).values().reverse()) {
        expect(entry).to.be(a[index]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a).keys().reverse()) {
        expect(entry).to.eql(index);
        index -= 1;
      }
    });
  });
}());
