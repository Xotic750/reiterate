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

  describe('Object.isNull', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.isNull()).to.not.be.ok();
      expect(reiterate.$.isNull(null)).to.be.ok();
      expect(reiterate.$.isNull(undefined)).to.not.be.ok();
      expect(reiterate.$.isNull('undefined')).to.not.be.ok();
      expect(reiterate.$.isNull('null')).to.not.be.ok();
      expect(reiterate.$.isNull(0)).to.not.be.ok();
      expect(reiterate.$.isNull(1)).to.not.be.ok();
      expect(reiterate.$.isNull('')).to.not.be.ok();
      expect(reiterate.$.isNull([])).to.not.be.ok();
      expect(reiterate.$.isNull({})).to.not.be.ok();
    });
  });
}());
