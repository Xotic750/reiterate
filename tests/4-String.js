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
        array = reiterate(a).values().toArray();

      // forward
      expect(array).to.eql(b);
      array = reiterate(a).keys().toArray();
      expect(array).to.eql(c);
      array = reiterate(a).entries().toArray();
      expect(array).to.eql(d);

      // reverse
      array = reiterate(a).values().reverse().toArray();
      expect(array).to.eql(b.reverse());
      array = reiterate(a).keys().reverse().toArray();
      expect(array).to.eql(c.reverse());
      array = reiterate(a).entries().reverse().toArray();
      expect(array).to.eql(d.reverse());
    });
  });
}());
