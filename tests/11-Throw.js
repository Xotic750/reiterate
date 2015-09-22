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
    it('Array then defined but not a function', function () {
      function noop() {}

      expect(function () {
        for (var entry of reiterate([]).then(null)) {
          noop(entry);
          break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Array circular', function () {
      var a = [1];

      a.push(a);

      function noop() {}

      expect(function () {
        for (var entry of reiterate(a).flatten()) {
          noop(entry);
          //break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });
  });
}());
