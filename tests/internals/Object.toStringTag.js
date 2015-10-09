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

  describe('Object.toStringTag', function () {
    it('basic', function () {
      expect(reiterate.$.toStringTag()).to.be('[object Undefined]');
      expect(reiterate.$.toStringTag(undefined)).to.be('[object Undefined]');
      expect(reiterate.$.toStringTag(null)).to.be('[object Null]');
      expect(reiterate.$.toStringTag(1)).to.be('[object Number]');
      expect(reiterate.$.toStringTag(true)).to.be('[object Boolean]');
      expect(reiterate.$.toStringTag('x')).to.be('[object String]');
      expect(reiterate.$.toStringTag([1, 2, 3])).to.be('[object Array]');
      expect(reiterate.$.toStringTag(reiterate.$.returnArgs()))
        .to.be('[object Arguments]');
      expect(reiterate.$.toStringTag({})).to.be('[object Object]');
      expect(reiterate.$.toStringTag(reiterate.$.noop)).to.be('[object Function]');
      expect(reiterate.$.toStringTag(new RegExp('c'))).to.be('[object RegExp]');
      expect(reiterate.$.toStringTag(new Date())).to.be('[object Date]');
      expect(reiterate.$.toStringTag(new Error('x'))).to.be('[object Error]');
    });

    it('Object prototypes', function () {
      expect(reiterate.$.toStringTag(Object.prototype))
        .to.be('[object Object]');
      expect(reiterate.$.toStringTag(Array.prototype)).to.be('[object Array]');
      expect(reiterate.$.toStringTag(Boolean.prototype))
        .to.be('[object Boolean]');
      expect(reiterate.$.toStringTag(Number.prototype))
        .to.be('[object Number]');
      expect(reiterate.$.toStringTag(String.prototype))
        .to.be('[object String]');
      expect(reiterate.$.toStringTag(Error.prototype)).to.be('[object Error]');
      expect(reiterate.$.toStringTag(Date.prototype)).to.be('[object Date]');
      expect(reiterate.$.toStringTag(RegExp.prototype))
        .to.be('[object RegExp]');
      expect(reiterate.$.toStringTag(Function.prototype))
        .to.be('[object Function]');
    });
  });
}());
