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
    it('First', function () {
      var a = [
          [
            ['a', 'b', 'c', 'd', 'e'], 1, 2, 3, 4, 5
          ], 1, 2, 3, 4, 5
        ],
        value = reiterate(a).values().flatten().first();

      expect(value).to.be('a');
      a = 'A\uD835\uDC68B\uD835\uDC69C\uD835\uDC6A';
      value = reiterate(a).values().first();
      expect(value).to.be('A');
    });
  });
}());
