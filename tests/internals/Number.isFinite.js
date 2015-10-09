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

  describe('Number.isFinite', function () {
    it('should not throw an error in each case', function () {
      var zero = 0;

      expect(reiterate.$.numIsFinite()).to.not.be.ok();
      expect(reiterate.$.numIsFinite(undefined)).to.not.be.ok();
      expect(reiterate.$.numIsFinite(null)).to.not.be.ok();
      expect(reiterate.$.numIsFinite(1)).to.be.ok();
      expect(reiterate.$.numIsFinite(Infinity)).to.not.be.ok();
      expect(reiterate.$.numIsFinite(-Infinity)).to.not.be.ok();
      expect(reiterate.$.numIsFinite(NaN)).to.not.be.ok();
      expect(reiterate.$.numIsFinite('')).to.not.be.ok();
      expect(reiterate.$.numIsFinite(true)).to.not.be.ok();
      expect(reiterate.$.numIsFinite(false)).to.not.be.ok();
      expect(reiterate.$.numIsFinite({})).to.not.be.ok();
      expect(reiterate.$.numIsFinite([])).to.not.be.ok();
      expect(reiterate.$.numIsFinite(new RegExp('c'))).to.not.be.ok();
      expect(reiterate.$.numIsFinite(new Date(2013, 11, 11))).to.not.be.ok();
      expect(reiterate.$.numIsFinite(new Error('x'))).to.not.be.ok();
      expect(reiterate.$.numIsFinite(4)).to.be.ok();
      expect(reiterate.$.numIsFinite(4.5)).to.be.ok();
      expect(reiterate.$.numIsFinite('hi')).to.not.be.ok();
      expect(reiterate.$.numIsFinite('1.3')).to.not.be.ok();
      expect(reiterate.$.numIsFinite('51')).to.not.be.ok();
      expect(reiterate.$.numIsFinite(0)).to.be.ok();
      expect(reiterate.$.numIsFinite(-0)).to.be.ok();
      expect(reiterate.$.numIsFinite({
        valueOf: function () {
          return 3;
        }
      })).to.not.be.ok();

      expect(reiterate.$.numIsFinite({
        valueOf: function () {
          return zero / zero;
        }
      })).to.not.be.ok();

      expect(reiterate.$.numIsFinite({
        valueOf: function () {
          throw 17;
        }
      })).to.not.be.ok();

      expect(reiterate.$.numIsFinite({
        toString: function () {
          throw 17;
        }
      })).to.not.be.ok();

      expect(reiterate.$.numIsFinite({
        valueOf: function () {
          throw 17;
        },
        toString: function () {
          throw 42;
        }
      })).to.not.be.ok();
    });
  });
}());
