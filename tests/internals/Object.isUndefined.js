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

  describe('Object.isUndefined', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.isUndefined()).to.be.ok();
      expect(reiterate.$.isUndefined(null)).to.not.be.ok();
      expect(reiterate.$.isUndefined(undefined)).to.be.ok();
      expect(reiterate.$.isUndefined('undefined')).to.not.be.ok();
      expect(reiterate.$.isUndefined('null')).to.not.be.ok();
      expect(reiterate.$.isUndefined(0)).to.not.be.ok();
      expect(reiterate.$.isUndefined(1)).to.not.be.ok();
      expect(reiterate.$.isUndefined('')).to.not.be.ok();
      expect(reiterate.$.isUndefined([])).to.not.be.ok();
      expect(reiterate.$.isUndefined({})).to.not.be.ok();
    });
  });
}());
