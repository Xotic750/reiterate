/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:24,
    maxcomplexity:3
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
        e = map(b, function (item) {
          return item.codePointAt();
        }),
        array = reiterate.string(a).values().asArray(),
        string = reiterate.string(a).values().asString(),
        iterator = reiterate.string(a).values().map(function (item) {
          return item.codePointAt();
        }),
        index = 0;

      // forward
      expect(string).to.be(a);
      expect(array).to.eql(b);
      array = reiterate.string(a).keys().asArray();
      expect(array).to.eql(c);
      array = reiterate.string(a).entries().asArray();
      expect(array).to.eql(d);
      forOf(iterator, function (entry) {
        expect(entry).to.be(e[index]);
        index += 1;
      });

      // reverse
      string = reiterate.string(a).values().reverse().asString();
      b.reverse();
      expect(string).to.be(b.join(''));
      array = reiterate.string(a).values().reverse().asArray();
      expect(array).to.eql(b);
      array = reiterate.string(a).keys().reverse().asArray();
      expect(array).to.eql(c.reverse());
      array = reiterate.string(a).entries().reverse().asArray();
      expect(array).to.eql(d.reverse());
      iterator = reiterate.string(a).values().reverse().map(function (item) {
        return item.codePointAt();
      });

      index = b.length - 1;
      forOf(iterator, function (entry) {
        expect(entry).to.be(e[index]);
        index -= 1;
      });
    });

    it('String state', function () {
      var gen = reiterate.string('').values().reverse(),
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
