/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:17,
    maxcomplexity:5
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject,
    forOf = required.forOf;

  describe('Basic static tests', function () {
    var a = {
        0: 1,
        1: 2,
        2: 3,
        3: 5,
        4: 1,
        5: 3,
        6: 1,
        7: 2,
        8: 4
      },
      b = [1, 2, 3, 5, 1, 3, 1, 2, 4],
      c = {
        0: 1,
        1: [2],
        2: 3,
        3: 5,
        4: [1, 3, [1]],
        5: 2,
        6: [4]
      },
      index,
      array;

    it('Object enumerate, no length', function () {
      // forward
      index = 0;
      forOf(reiterate.enumerate(a), function (entry) {
        expect(entry).to.eql(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.enumerate(a).entries(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.enumerate(a).values(), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.enumerate(a).keys(), function (entry) {
        expect(entry).to.eql(index);
        index += 1;
      });

      // reverse
      expect(function () {
        reiterate.enumerate(a).reverse();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Object enumerate own, no length', function () {
      // forward
      index = 0;
      forOf(reiterate.enumerate(a).own(), function (entry) {
        expect(entry).to.eql(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.enumerate(a).own().entries(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.enumerate(a).own().values(), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.enumerate(a).own().keys(), function (entry) {
        expect(entry).to.eql(index);
        index += 1;
      });

      // reverse
      expect(function () {
        reiterate.enumerate(a).own().reverse();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Object enumerate own flatten, no length', function () {
      array = reiterate.enumerate(c).own().values().flatten().asArray();
      expect(array).to.eql(b);
    });

    it('Object state', function () {
      var gen = reiterate.enumerate({}).own(),
        state = gen.state();

      expect(state).to.eql({
        entries: false,
        values: true,
        keys: false,
        own: true
      });
    });
  });
}());
