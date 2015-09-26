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
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Difference', function () {
      var a = [1, 2, 3, 4, 5],
        array = reiterate(a).values().difference([4, 2]).valueOf();

      expect(array).to.eql([1, 3, 5]);
      array = reiterate(a).values().difference([4, 2]).asObject();
      expect(array).to.eql({
        0: 1,
        1: 3,
        2: 5
      });

      expect(array.length).to.be(3);
      array = reiterate(a).values().difference([4, 2]).asMap();
      expect(array.size).to.be(3);
      expect(array.get(0)).to.be(1);
      expect(array.get(1)).to.be(3);
      expect(array.get(2)).to.be(5);
      array = reiterate(a).values().difference({
        'a': 4,
        'b': 2
      }).valueOf();

      expect(array).to.eql([1, 3, 5]);
      a = 'A\uD835\uDC68B\uD835\uDC69C\uD835\uDC6A';
      array = reiterate(a).values().difference('A\uD835\uDC69B').asString();
      expect(array).to.be('\uD835\uDC68C\uD835\uDC6A');
      array = reiterate(a).values().difference('A\uD835\uDC69B').valueOf();
      expect(array).to.eql(['\uD835\uDC68', 'C', '\uD835\uDC6A']);
      array = reiterate(a).values().difference('A\uD835\uDC69B').toString();
      expect(array).to.be('\uD835\uDC68,C,\uD835\uDC6A');
    });
  });
}());
