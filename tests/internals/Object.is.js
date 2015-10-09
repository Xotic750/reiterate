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

  describe('Object.is', function () {
    var date = new Date(),
      rx = new RegExp('x'),
      err = new Error('y');

    it('should not throw an error in each case', function () {
      expect(reiterate.$.is(undefined, undefined)).to.be.ok();
      expect(reiterate.$.is(null, null)).to.be.ok();
      expect(reiterate.$.is(1, 1)).to.be.ok();
      expect(reiterate.$.is(true, true)).to.be.ok();
      expect(reiterate.$.is('x', 'x')).to.be.ok();
      expect(reiterate.$.is([1, 2, 3], [1, 2, 3])).to.not.be.ok();
      expect(reiterate.$.is(reiterate.$.returnArgs(), reiterate.$.returnArgs()))
        .to.not.be.ok();
      expect(reiterate.$.is({}, {}), false, 'Object.is');
      expect(reiterate.$.is(reiterate.$.noop, reiterate.$.noop)).to.be.ok();
      expect(reiterate.$.is(new RegExp('c'), new RegExp('c'))).to.not.be.ok();
      expect(reiterate.$.is(new Date(2013, 11, 23), new Date(2013, 11, 23)))
        .to.not.be.ok();
      expect(reiterate.$.is(new Error('x'), new Error('x'))).to.not.be.ok();
      expect(reiterate.$.is(date, date)).to.be.ok();
      expect(reiterate.$.is(rx, rx)).to.be.ok();
      expect(reiterate.$.is(err, err)).to.be.ok();
      expect(reiterate.$.is(NaN, NaN)).to.be.ok();
      expect(reiterate.$.is(0, -0)).to.not.be.ok();
      expect(reiterate.$.is(0, 0)).to.be.ok();
      expect(reiterate.$.is(0, +0)).to.be.ok();
    });
  });
}());
