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
    it('Union', function () {
      var a = reiterate().to(3),
        b = reiterate().from(3).to(6),
        c = reiterate().from(6).to(9),
        d = reiterate().to(10),
        value = reiterate(a).union(b, c, d).valueOf();

      expect(value).to.eql(reiterate().to(10).valueOf());
      a = reiterate([0, 1, 2]).values();
      b = reiterate([4, 5, 6]).values();
      c = reiterate([8, 9]).values();
      d = reiterate([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).values();
      value = reiterate(a).union(b, c, d).valueOf();
      expect(value).to.eql([0, 1, 2, 4, 5, 6, 8, 9, 3, 7, 10]);
      a = reiterate().to(3);
      b = reiterate().from(3).to(6);
      c = reiterate().from(6).to(9);
      d = reiterate().to(10);
      value = reiterate(a).union(b, c, d).asSet();
      expect(value.size).to.be(11);
      expect(value.has(0)).to.be(true);
      expect(value.has(1)).to.be(true);
      expect(value.has(2)).to.be(true);
      expect(value.has(3)).to.be(true);
      expect(value.has(4)).to.be(true);
      expect(value.has(5)).to.be(true);
      expect(value.has(6)).to.be(true);
      expect(value.has(7)).to.be(true);
      expect(value.has(8)).to.be(true);
      expect(value.has(9)).to.be(true);
      expect(value.has(10)).to.be(true);
      value = reiterate([]).union().asSet();
      expect(value.size).to.be(0);
      value = reiterate([1]).union().asSet();
      expect(value.size).to.be(1);
    });
  });
}());
