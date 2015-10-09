/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Function.noop', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.noop()).to.be(undefined);
      expect(reiterate.$.noop(1, 2, 3)).to.be(undefined);
      expect(reiterate.$.isFunction(reiterate.$.noop)).to.be.ok();
    });
  });
}());
