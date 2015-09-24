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

  describe('Basic static tests', function () {
    it('Repeat', function () {
      var iterator = reiterate.repeat('a', 5);

      expect(iterator.toArray()).to.eql(['a', 'a', 'a', 'a', 'a']);
      iterator = reiterate.repeat('a', Infinity).take(5);
      expect(iterator.toArray()).to.eql(['a', 'a', 'a', 'a', 'a']);
      iterator = reiterate.repeat('a', 5);
      expect(iterator.join('')).to.be('aaaaa');
      iterator = reiterate.repeat('a');
      expect(iterator.join('')).to.be('');
    });
  });
}());
