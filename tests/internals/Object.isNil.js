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

  describe('Object.isNil', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.isNil()).to.be.ok();
      expect(reiterate.$.isNil(null)).to.be.ok();
      expect(reiterate.$.isNil(undefined)).to.be.ok();
      expect(reiterate.$.isNil('undefined')).to.not.be.ok();
      expect(reiterate.$.isNil('null')).to.not.be.ok();
      expect(reiterate.$.isNil(0)).to.not.be.ok();
      expect(reiterate.$.isNil(1)).to.not.be.ok();
      expect(reiterate.$.isNil('')).to.not.be.ok();
      expect(reiterate.$.isNil([])).to.not.be.ok();
      expect(reiterate.$.isNil({})).to.not.be.ok();
    });
  });
}());
