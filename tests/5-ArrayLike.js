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
    it('ArrayLike of primatives', function () {
      var a = {
          0: 1,
          1: 2,
          2: 3,
          3: 5,
          4: 1,
          5: 3,
          6: 1,
          7: 2,
          8: 4,
          length: 9
        },
        index = 0,
        entry;

      // forward
      for (entry of reiterate(a, true)) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a, true).entries()) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a, true).values()) {
        expect(entry).to.be(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a, true).keys()) {
        expect(entry).to.eql(index);
        index += 1;
      }

      // reverse
      index = a.length - 1;
      for (entry of reiterate(a, true).reverse()) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a, true).entries().reverse()) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a, true).values().reverse()) {
        expect(entry).to.be(a[index]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a, true).keys().reverse()) {
        expect(entry).to.eql(index);
        index -= 1;
      }
    });
  });
}());
