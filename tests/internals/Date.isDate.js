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

  describe('Date.isDate', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.isDate(new RegExp('test'))).to.not.be.ok();
      expect(reiterate.$.isDate(new Date())).to.be.ok();
      expect(reiterate.$.isDate(/test/)).to.not.be.ok();
      expect(reiterate.$.isDate([])).to.not.be.ok();
      expect(reiterate.$.isDate({})).to.not.be.ok();
      expect(reiterate.$.isDate('')).to.not.be.ok();
      expect(reiterate.$.isDate(1)).to.not.be.ok();
      expect(reiterate.$.isDate(true)).to.not.be.ok();
      expect(reiterate.$.isDate()).to.not.be.ok();
      expect(reiterate.$.isDate(null)).to.not.be.ok();
      expect(reiterate.$.isDate(reiterate.$.noop)).to.not.be.ok();
      expect(reiterate.$.isDate(reiterate.$.returnArgs())).to.not.be.ok();
      expect(reiterate.$.isDate(Date.prototype)).to.be.ok();
    });
  });
}());
