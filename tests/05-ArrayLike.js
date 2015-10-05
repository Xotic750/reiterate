/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject,
    forOf = required.forOf,
    map = required.map;

  describe('Basic tests', function () {
    it('ArrayLike of primatives', function () {
      var a = {
          0: 1,
          1: 2,
          2: 3,
          3: 5,
          4: 1,
          5: 3,
          6: 1,
          7: 2,
          8: 4,
          length: 9
        },
        b = [1, 2, 3, 5, 4],
        c = [4, 2, 1, 3, 5],
        d = [1, 2, 3, 5, 1, 3, 1, 2, 4],
        e = {
          0: 1,
          1: {
            0: 2,
            length: 1
          },
          2: 3,
          3: 5,
          4: {
            0: 1,
            1: 3,
            2: {
              0: 1,
              length: 1
            },
            length: 3
          },
          5: 2,
          6: {
            0: 4,
            length: 1
          },
          length: 7
        },
        index = 0,
        array;

      // forward
      forOf(reiterate(a, true), function (entry) {
        expect(entry).to.eql(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a, true).entries(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a, true).values(), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a, true).keys(), function (entry) {
        expect(entry).to.eql(index);
        index += 1;
      });

      // reverse
      index = a.length - 1;
      forOf(reiterate(a, true).reverse(), function (entry) {
        expect(entry).to.eql(a[index]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate(a, true).entries().reverse(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate(a, true).values().reverse(), function (entry) {
        expect(entry).to.be(a[index]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate(a, true).keys().reverse(), function (entry) {
        expect(entry).to.eql(index);
        index -= 1;
      });

      // unique
      array = reiterate(a, true).values().unique().asArray();
      expect(array).to.eql(b);

      array = reiterate(a, true).values().reverse().unique().asArray();
      expect(array).to.eql(c);

      // map
      array = reiterate(a, true).values().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(map(d, function (item) {
        return String(item);
      }));

      array = reiterate(a, true).values().reverse().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(map(d.slice().reverse(), function (item) {
        return String(item);
      }));

      // filter
      array = reiterate(a, true).values().filter(function (item) {
        return item === 1;
      }).asArray();

      expect(array).to.eql(d.filter(function (item) {
        return item === 1;
      }));

      array = reiterate(a, true).values().reverse().filter(function (item) {
        return item === 1;
      }).asArray();

      expect(array).to.eql(d.slice().reverse().filter(function (item) {
        return item === 1;
      }));

      // flatten
      array = reiterate(e, true).values().flatten(true).asArray();
      expect(array).to.eql(d);
    });

    it('Array-like state', function () {
      var gen = reiterate({
          length: 0
        }, true).entries().reverse(),
        state = gen.state();

      expect(state).to.eql({
        length: 0,
        from: 0,
        to: -1,
        by: 1,
        reversed: true,
        entries: true,
        values: false,
        keys: false
      });

      gen = reiterate({
        length: Number.MAX_SAFE_INTEGER
      }, true);
      state = gen.state();
      expect(state).to.eql({
        length: Number.MAX_SAFE_INTEGER,
        from: 0,
        to: Number.MAX_SAFE_INTEGER - 1,
        by: 1,
        reversed: false,
        entries: false,
        values: true,
        keys: false
      });
    });
  });
}());
