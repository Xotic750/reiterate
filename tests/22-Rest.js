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
    it('Rest', function () {
      var a = [1, 2, 3, 4, 5],
        array = reiterate(a).values().rest().valueOf();

      expect(array).to.eql([2, 3, 4, 5]);
      array = reiterate(a).values().rest().asObject();
      expect(array).to.eql({
        0: 2,
        1: 3,
        2: 4,
        3: 5
      });

      expect(array.length).to.be(4);
      array = reiterate(a).values().rest().asMap();
      expect(array.size).to.be(4);
      expect(array.get(0)).to.be(2);
      expect(array.get(1)).to.be(3);
      expect(array.get(2)).to.be(4);
      expect(array.get(3)).to.be(5);
      a = 'A\uD835\uDC68B\uD835\uDC69C\uD835\uDC6A';
      array = reiterate(a).values().rest().asString();
      expect(array).to.be('\uD835\uDC68B\uD835\uDC69C\uD835\uDC6A');
      array = reiterate(a).values().rest().valueOf();
      expect(array).to.eql([
        '\uD835\uDC68',
        'B',
        '\uD835\uDC69',
        'C',
        '\uD835\uDC6A'
      ]);

      array = reiterate(a).values().rest().toString();
      expect(array).to.be('\uD835\uDC68,B,\uD835\uDC69,C,\uD835\uDC6A');
    });
  });
}());
