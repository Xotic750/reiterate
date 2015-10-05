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

  describe('Basic static tests', function () {
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
      forOf(reiterate.array(a), function (entry) {
        expect(entry).to.eql(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.array(a).entries(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.array(a).values(), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.array(a).keys(), function (entry) {
        expect(entry).to.eql(index);
        index += 1;
      });

      // reverse
      index = a.length - 1;
      forOf(reiterate.array(a).reverse(), function (entry) {
        expect(entry).to.eql(a[index]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate.array(a).entries().reverse(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate.array(a).values().reverse(), function (entry) {
        expect(entry).to.be(a[index]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate.array(a).keys().reverse(), function (entry) {
        expect(entry).to.eql(index);
        index -= 1;
      });

      // unique
      array = reiterate.array(a).values().unique().asArray();
      expect(array).to.eql(b);

      array = reiterate.array(a).values().reverse().unique().asArray();
      expect(array).to.eql(c);

      // map
      array = reiterate.array(a).values().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(map(d, function (item) {
        return String(item);
      }));

      array = reiterate.array(a).values().reverse().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(map(d.slice().reverse(), function (item) {
        return String(item);
      }));

      // filter
      array = reiterate.array(a).values().filter(function (item) {
        return item === 1;
      }).asArray();

      expect(array).to.eql(d.filter(function (item) {
        return item === 1;
      }));

      array = reiterate.array(a).values().reverse().filter(function (item) {
        return item === 1;
      }).asArray();

      expect(array).to.eql(d.slice().reverse().filter(function (item) {
        return item === 1;
      }));

      // flatten
      array = reiterate.array(e).values().flatten(true).asArray();
      expect(array).to.eql(d);
    });

    it('Array-like state', function () {
      var gen = reiterate.array({
          length: 0
        }).entries().reverse(),
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
    });
  });
}());
