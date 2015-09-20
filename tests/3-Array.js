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
    it('Array of primatives', function () {
      var a = [1, 2, 3, 5, 1, 3, 1, 2, 4],
        b = [1, 2, 3, 5, 4],
        c = [4, 2, 1, 3, 5],
        index = 0,
        entry,
        array;

      // forward
      for (entry of reiterate(a)) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a).entries()) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a).values()) {
        expect(entry).to.be(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a).keys()) {
        expect(entry).to.eql(index);
        index += 1;
      }

      // reverse
      index = a.length - 1;
      for (entry of reiterate(a).reverse()) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a).entries().reverse()) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a).values().reverse()) {
        expect(entry).to.be(a[index]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a).keys().reverse()) {
        expect(entry).to.eql(index);
        index -= 1;
      }

      // unique
      array = reiterate(a).values().unique().toArray();
      expect(array).to.eql(b);

      array = reiterate(a).values().reverse().unique().toArray();
      expect(array).to.eql(c);

      // map
      array = reiterate(a).values().map(function (item) {
        return String(item);
      }).toArray();

      expect(array).to.eql(a.map(function (item) {
        return String(item);
      }));

      array = reiterate(a).values().reverse().map(function (item) {
        return String(item);
      }).toArray();

      expect(array).to.eql(a.slice().reverse().map(function (item) {
        return String(item);
      }));

      // filter
      array = reiterate(a).values().filter(function (item) {
        return item === 1;
      }).toArray();

      expect(array).to.eql(a.filter(function (item) {
        return item === 1;
      }));

      array = reiterate(a).values().reverse().filter(function (item) {
        return item === 1;
      }).toArray();

      expect(array).to.eql(a.slice().reverse().filter(function (item) {
        return item === 1;
      }));
    });
  });
}());
