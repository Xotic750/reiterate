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

  describe('Function.returnArgs', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.chop(reiterate.$.returnArgs())).to.eql([]);
      expect(reiterate.$.chop(reiterate.$.returnArgs(1, 2, 3))).to.eql([1, 2, 3]);
      expect(reiterate.$.chop(reiterate.$.returnArgs(reiterate.$.noop)))
        .to.eql([reiterate.$.noop]);
    });
  });
}());
