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

  describe('Object.isObject', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.isObject()).to.not.be.ok();
      expect(reiterate.$.isObject(null)).to.not.be.ok();
      expect(reiterate.$.isObject('')).to.not.be.ok();
      expect(reiterate.$.isObject(1)).to.not.be.ok();
      expect(reiterate.$.isObject(false)).to.not.be.ok();
      expect(reiterate.$.isObject({})).to.be.ok();
      expect(reiterate.$.isObject([])).to.be.ok();
      expect(reiterate.$.isObject(reiterate.$.noop)).to.be.ok();
    });
  });
}());
