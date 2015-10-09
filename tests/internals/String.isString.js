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

  describe('String.isString', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.isString(Object('a'))).to.be.ok();
      expect(reiterate.$.isString(true)).to.not.be.ok();
      expect(reiterate.$.isString(false)).to.not.be.ok();
      expect(reiterate.$.isString()).to.not.be.ok();
      expect(reiterate.$.isString(null)).to.not.be.ok();
      expect(reiterate.$.isString('')).to.be.ok();
      expect(reiterate.$.isString(0)).to.not.be.ok();
      expect(reiterate.$.isString(1)).to.not.be.ok();
      expect(reiterate.$.isString({})).to.not.be.ok();
      expect(reiterate.$.isString([])).to.not.be.ok();
      expect(reiterate.$.isString(String.prototype)).to.be.ok();
    });
  });
}());
