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
    it('Intersection', function () {
      var a = reiterate([4, 2]).values(),
        b = reiterate([2, 1]).values(),
        array = reiterate([1, 2]).values().intersection(a, b).valueOf();

      expect(array).to.eql([2]);

      a = reiterate([5, 2, 1, 4]).values();
      b = reiterate([2, 1]).values();
      array = reiterate([1, 3, 2]).values().intersection(a, b).valueOf();
      expect(array).to.eql([1, 2]);

      a = reiterate([5, 2, 2, 1, 4]).values();
      b = reiterate([2, 1, 1]).values();
      array = reiterate([1, 1, 3, 2, 2]).values().intersection(a, b).valueOf();
      expect(array).to.eql([1, 2]);

      a = reiterate([1, NaN, 3]).values();
      b = reiterate([NaN, 5, NaN]).values();
      array = reiterate([1, 3, NaN, 2]).values().intersection(a, b).valueOf();
      expect(array.length).to.be(1);
      expect(array[0]).to.not.be(array[0]);

      array = reiterate([1, 1, 3, 2, 2]).values().intersection().valueOf();
      expect(array).to.eql([1, 3, 2]);

      a = reiterate([5, 2, 2, 1, 4]).values();
      b = reiterate([2, 1, 1]).values();
      array = reiterate([1, 1, 3, 2, 2]).values().intersection(a, b).asSet();
      expect(array.size).to.be(2);
      expect(array.has(1)).to.be(true);
      expect(array.has(2)).to.be(true);
    });
  });
}());
