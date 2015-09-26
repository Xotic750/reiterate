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
    it('Other iterables', function () {
      var a = new Map().set(0, 1).set(1, 2).set(2, 3),
        array = reiterate(a).valueOf();

      expect(array).to.eql([
        [0, 1],
        [1, 2],
        [2, 3]
      ]);
      array = reiterate(a.values()).valueOf();
      expect(array).to.eql([1, 2, 3]);
      array = reiterate(a.keys()).valueOf();
      expect(array).to.eql([0, 1, 2]);
      a = new Set().add(0).add(1).add(2);
      array = reiterate(a).valueOf();
      expect(array).to.eql([0, 1, 2]);

      a = {
        a: 1,
        b: 2,
        c: 3
      };

      a[Symbol.iterator] = function* () {
        for (var key in this) {
          if (this.hasOwnProperty(key)) {
            yield this[key];
          }
        }
      };

      array = reiterate(a).valueOf();
      expect(array).to.eql([1, 2, 3]);

      a[Symbol.iterator] = function* () {
        for (var key in this) {
          if (this.hasOwnProperty(key)) {
            yield key;
          }
        }
      };

      array = reiterate(a).valueOf();
      expect(array).to.eql(['a', 'b', 'c']);

      array = reiterate(a).toString();
      expect(array).to.be('a,b,c');

      array = reiterate(a).asString();
      expect(array).to.be('abc');
    });
  });
}());
