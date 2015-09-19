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
    it('Counter simple', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate()) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.eql(index);
        index += 1;
        if (index > 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(undefined)) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(null)) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(9)) {
        expect(entry).to.be.within(0, 9);
        expect(entry).to.be(index);
        index += 1;
      }

      // reverse
      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate().reverse()) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate(undefined).reverse()) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate(null).reverse()) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = -9;
      for (entry of reiterate(-9).reverse()) {
        expect(entry).to.be.within(-9, 0);
        expect(entry).to.be(index);
        index += 1;
      }
    });

    it('Counter specific arguments', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate(0, 10)) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate(-10, 0)) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 1;
      }

      index = 10;
      for (entry of reiterate(10, -20)) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = -20;
      for (entry of reiterate(-20, -10)) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 1;
      }

      // reverse
      index = 10;
      for (entry of reiterate(0, 10).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate(10, 0).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(-10, 0).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = -10;
      for (entry of reiterate(0, -10).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 1;
      }
    });

    it('Counter with by', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate(0, 10, 1)) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate(-10, 0, 2)) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 10;
      for (entry of reiterate(10, -20, 3)) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -20;
      for (entry of reiterate(-20, -10, -2)) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 2;
      }

      // reverse
      index = 10;
      for (entry of reiterate(0, 10, 1).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate(10, 0, 2).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 0;
      for (entry of reiterate(-10, 0, 3).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -10;
      for (entry of reiterate(0, -10, -2).reverse()) {
        expect(entry).to.be.within(-10, 0);
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
        expect(0).to.eql(index);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(0, 0)) {
        expect(entry).to.eql(index);
        expect(0).to.eql(index);
        index += 1;
      }

      index = 0;
      expect(function () {
        reiterate(0, 10, 0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Counter simple mixed sugar', function () {
      var index = 10,
        entry;

      // forward
      for (entry of reiterate().from(10)) {
        expect(entry).to.be.within(10, Number.MAX_SAFE_INTEGER);
        expect(entry).to.eql(index);
        index += 1;
        if (index > 20) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(undefined).to(10)) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(null).by(2)) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 2;
        if (index > 10) {
          break;
        }
      }

      index = 10;
      for (entry of reiterate().from(10).to(20).by(2)) {
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 2;
      }

      // reverse
      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate().from(10).reverse()) {
        expect(entry).to.be.within(10, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = 10;
      for (entry of reiterate(undefined).to(10).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 10;
      for (entry of reiterate().from(0).to(10).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate().from(-10).to(0).by(-2).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 2;
      }
    });

    it('Counter using sugar', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate().from(0).to(10).by(1)) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate().from(-10).to(0).by(2)) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 10;
      for (entry of reiterate().from(10).to(-20).by(3)) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -20;
      for (entry of reiterate().from(-20).to(-10).by(2)) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 2;
      }

      // reverse
      index = 10;
      for (entry of reiterate().from(0).to(10).by(1).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate().from(10).to(0).by(2).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 0;
      for (entry of reiterate().from(-10).to(0).by(3).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -10;
      for (entry of reiterate().from(0).to(-10).by(-2).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }
    });

    it('Counter zeros', function () {
      var index = 0,
        entry;

      index = 0;
      for (entry of reiterate(0)) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(0, 0)) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      }

      expect(function () {
        reiterate(0, 0, 0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      index = 0;
      for (entry of reiterate().to(0)) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      }

      index = 0;
      for (entry of reiterate().from(0).to(0)) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      }

      expect(function () {
        reiterate().from(0).to(0).by(0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate().by(0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Counter limits', function () {
      var entry;

      for (entry of reiterate().from(-Infinity).to(Infinity)) {
        expect(entry).to.be(Number.MIN_SAFE_INTEGER);
        break;
      }

      for (entry of reiterate().from(Infinity).to(-Infinity)) {
        expect(entry).to.be(Number.MAX_SAFE_INTEGER);
        break;
      }
    });

    it('Counter next', function () {
      var counter = reiterate().from(0).to(3).by(1);

      expect(counter.next()).to.eql({
        value: 0,
        done: false
      });

      expect(counter.next()).to.eql({
        value: 1,
        done: false
      });

      expect(counter.next()).to.eql({
        value: 2,
        done: false
      });

      expect(counter.next()).to.eql({
        value: 3,
        done: false
      });

      expect(counter.next()).to.eql({
        value: undefined,
        done: true
      });
    });

    it('Counter hidden once used', function () {
      var counter = reiterate();

      expect(counter.from).to.be.a('function');
      expect(counter.to).to.be.a('function');
      expect(counter.by).to.be.a('function');
      expect(counter.reverse).to.be.a('function');

      counter.from(0);
      expect(counter.from).to.be(undefined);

      counter.to(10);
      expect(counter.to).to.be(undefined);

      counter.by(1);
      expect(counter.by).to.be(undefined);

      counter.reverse();
      expect(counter.reverse).to.be(undefined);
    });

    it('Counter already started', function () {
      var counter = reiterate();

      expect(counter.next()).to.eql({
        value: 0,
        done: false
      });

      expect(function () {
        counter.from(0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        counter.to(3);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        counter.by(1);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        counter.reverse();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });
  });
}());
