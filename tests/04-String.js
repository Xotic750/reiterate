/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:28,
    maxcomplexity:5
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('UTF-16 string', function () {
      var a = 'A\uD835\uDC68B\uD835\uDC69C\uD835\uDC6A',
        b = ['A', '\uD835\uDC68', 'B', '\uD835\uDC69', 'C', '\uD835\uDC6A'],
        c = [0, 1, 3, 4, 6, 7],
        d = [
          [0, 'A'],
          [1, '\uD835\uDC68'],
          [3, 'B'],
          [4, '\uD835\uDC69'],
          [6, 'C'],
          [7, '\uD835\uDC6A']
        ],
        e = b.map(function (item) {
          return item.codePointAt();
        }),
        array = reiterate(a).values().valueOf(),
        string = reiterate(a).values().asString(),
        iterator = reiterate(a).values().map(function (item) {
          return item.codePointAt();
        }),
        index = 0,
        entry;

      // forward
      index = 0;
      for (entry of reiterate('').values()) {
        index += 1;
      }

      expect(index).to.be(0);

      expect(string).to.be(a);
      expect(array).to.eql(b);
      array = reiterate(a).keys().valueOf();
      expect(array).to.eql(c);
      array = reiterate(a).entries().valueOf();
      expect(array).to.eql(d);
      for (entry of iterator) {
        expect(entry).to.be(e[index]);
        index += 1;
      }

      // reverse
      string = reiterate(a).values().reverse().asString();
      b.reverse();
      expect(string).to.be(b.join(''));
      array = reiterate(a).values().reverse().valueOf();
      expect(array).to.eql(b);
      array = reiterate(a).keys().reverse().valueOf();
      expect(array).to.eql(c.reverse());
      array = reiterate(a).entries().reverse().valueOf();
      expect(array).to.eql(d.reverse());
      iterator = reiterate(a).values().reverse().map(function (item) {
        return item.codePointAt();
      });

      index = b.length - 1;
      for (entry of iterator) {
        expect(entry).to.be(e[index]);
        index -= 1;
      }
    });

    it('String chars', function () {
      var a =
        '\uD835\uDC68\uD835\uDC69\uD835\uDC6A\uD835\uDC6B\uD835\uDC6C',
        gen = reiterate(a).keys().slice(1, -3),
        entry,
        index;

      // forward
      index = 2;
      for (entry of gen) {
        expect(entry).to.be.within(2, a.length - 4);
        expect(entry).to.eql(index);
        index += 2;
      }

      gen = reiterate(a).keys().slice(-3);
      for (entry of gen) {
        expect(entry).to.eql(8);
      }

      gen = reiterate(a).keys().slice(1, 3);
      index = 2;
      for (entry of gen) {
        expect(entry).to.be.within(2, 4);
        expect(entry).to.eql(index);
        index += 2;
      }

      // reverse
      gen = reiterate(a).keys().slice(1, -3).reverse();
      index = a.length - 4;
      for (entry of gen) {
        expect(entry).to.be.within(1, a.length - 4);
        expect(entry).to.eql(index);
        index -= 2;
      }
    });

    it('String state', function () {
      var gen = reiterate('').values().reverse(),
        state = gen.state();

      expect(state).to.eql({
        length: 0,
        from: 0,
        to: -1,
        by: 1,
        reversed: true,
        entries: false,
        values: true,
        keys: false
      });
    });
  });
}());
