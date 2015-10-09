/*jslint maxlen:80, es6:false, this:true */
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


  describe('Array.isArray', function () {
    it('missing, null and undefined', function () {
      expect(reiterate.$.isArray()).to.not.be.ok();
      expect(reiterate.$.isArray(undefined)).to.not.be.ok();
      expect(reiterate.$.isArray(null)).to.not.be.ok();
    });

    it('primitives', function () {
      expect(reiterate.$.isArray(1)).to.not.be.ok();
      expect(reiterate.$.isArray(true)).to.not.be.ok();
      expect(reiterate.$.isArray('')).to.not.be.ok();
    });

    it('array', function () {
      expect(reiterate.$.isArray([])).to.be.ok();
    });

    it('objects', function () {
      expect(reiterate.$.isArray(new Error('x'))).to.not.be.ok();
      expect(reiterate.$.isArray(new Date())).to.not.be.ok();
      expect(reiterate.$.isArray(new RegExp('x'))).to.not.be.ok();
      expect(reiterate.$.isArray(reiterate.$.noop)).to.not.be.ok();
      expect(reiterate.$.isArray({
        0: 'a',
        length: 1
      })).to.not.be.ok();
    });

    it('arguments', function () {
      expect(reiterate.$.isArray(reiterate.$.returnArgs())).to.not.be.ok();
    });

    it('Array.prototype', function () {
      expect(reiterate.$.isArray(Array.prototype)).to.be.ok();
    });

    if (required.frame) {
      it('should work accross frames', function () {
        expect(reiterate.$.isArray(new required.frame.Array(1, 2, 3)))
          .to.be.ok();
      });
    }
  });
}());
