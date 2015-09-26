/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:50,
    maxcomplexity:10
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Array of primatives', function () {
      var a = [1, 2, 3, 5, 1, 3, 1, 2, 4],
        b = [1, 2, 3, 5, 4],
        c = [4, 2, 1, 3, 5],
        d = [1, [2], 3, [5, 1, [3]], 1, 2, [4]],
        index = 0,
        entry,
        array;

      // forward
      for (entry of reiterate(a)) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate([]).values()) {
        index += 1;
      }

      expect(index).to.be(0);

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

      // unique
      array = reiterate(a).values().unique().valueOf();
      expect(array).to.eql(b);

      array = reiterate(a).values().reverse().unique().valueOf();
      expect(array).to.eql(c);

      // map
      array = reiterate(a).values().map(function (item) {
        return String(item);
      }).valueOf();

      expect(array).to.eql(a.map(function (item) {
        return String(item);
      }));

      array = reiterate(a).values().reverse().map(function (item) {
        return String(item);
      }).valueOf();

      expect(array).to.eql(a.slice().reverse().map(function (item) {
        return String(item);
      }));

      // filter
      array = reiterate(a).values().filter(function (item) {
        return item === 1;
      }).valueOf();

      expect(array).to.eql(a.filter(function (item) {
        return item === 1;
      }));

      array = reiterate(a).values().reverse().filter(function (item) {
        return item === 1;
      }).valueOf();

      expect(array).to.eql(a.slice().reverse().filter(function (item) {
        return item === 1;
      }));

      // flatten
      array = reiterate(d).values().flatten().valueOf();
      expect(array).to.eql(a);
    });

    it('Array slice', function () {
      var a = [1, 2, 3, 4, 5],
        gen = reiterate(a).keys().slice(1, -1),
        entry,
        index;

      // forward
      index = 1;
      for (entry of gen) {
        expect(entry).to.be.within(1, a.length - 2);
        expect(entry).to.eql(index);
        index += 1;
      }

      gen = reiterate(a).keys().slice(-1);
      for (entry of gen) {
        expect(entry).to.eql(4);
      }

      gen = reiterate(a).keys().slice(1, 3);
      index = 1;
      for (entry of gen) {
        expect(entry).to.be.within(1, 3);
        expect(entry).to.eql(index);
        index += 1;
      }

      // reverse
      gen = reiterate(a).keys().slice(1, -1).reverse();
      index = a.length - 2;
      for (entry of gen) {
        expect(entry).to.be.within(1, a.length - 2);
        expect(entry).to.eql(index);
        index -= 1;
      }
    });

    it('Array drop', function () {
      var a = [1, 2, 3, 4, 5],
        array;

      // zero
      array = reiterate(a).values().drop().valueOf();
      expect(array).to.eql(a);

      // forward
      array = reiterate(a).values().drop(2).valueOf();
      expect(array).to.eql([3, 4, 5]);

      // reverse
      array = reiterate(a).values().reverse().drop(2).valueOf();
      expect(array).to.eql([3, 2, 1]);
    });

    it('Array take', function () {
      var a = [1, 2, 3, 4, 5],
        array;

      // zero
      array = reiterate(a).values().take().valueOf();
      expect(array).to.eql([]);

      // forward
      array = reiterate(a).values().take(2).valueOf();
      expect(array).to.eql([1, 2]);

      // reverse
      array = reiterate(a).values().reverse().take(2).valueOf();
      expect(array).to.eql([5, 4]);
    });

    it('Array state', function () {
      var gen = reiterate([]).keys().reverse(),
        state = gen.state();

      expect(state).to.eql({
        length: 0,
        from: 0,
        to: -1,
        by: 1,
        reversed: true,
        entries: false,
        values: false,
        keys: true
      });
    });
  });
}());
