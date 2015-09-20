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
        array = reiterate(a).values().toArray(),
        string = reiterate(a).values().stringify(),
        iterator = reiterate(a).values().map(function (item) {
          return item.codePointAt();
        }),
        index = 0,
        entry;

      // forward
      expect(string).to.be(a);
      expect(array).to.eql(b);
      array = reiterate(a).keys().toArray();
      expect(array).to.eql(c);
      array = reiterate(a).entries().toArray();
      expect(array).to.eql(d);
      for (entry of iterator) {
        expect(entry).to.be(e[index]);
        index += 1;
      }

      // reverse
      string = reiterate(a).values().reverse().stringify();
      b.reverse();
      expect(string).to.be(b.join(''));
      array = reiterate(a).values().reverse().toArray();
      expect(array).to.eql(b);
      array = reiterate(a).keys().reverse().toArray();
      expect(array).to.eql(c.reverse());
      array = reiterate(a).entries().reverse().toArray();
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
  });
}());
