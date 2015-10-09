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

  describe('Number.isNaN', function () {
    var toObj = Object;

    it('NaN should be be true', function () {
      expect(reiterate.$.numIsNaN(NaN)).to.be(true);
    });

    it('Object(NaN) should be false', function () {
      expect(reiterate.$.numIsNaN(toObj(NaN))).to.be(false);
    });

    it('No arguments, undefined and null should be false', function () {
      expect(reiterate.$.numIsNaN()).to.be(false);
      expect(reiterate.$.numIsNaN(undefined)).to.be(false);
      expect(reiterate.$.numIsNaN(null)).to.be(false);
    });

    it('Other numbers should be false', function () {
      expect(reiterate.$.numIsNaN(Infinity)).to.be(false);
      expect(reiterate.$.numIsNaN(-Infinity)).to.be(false);
      expect(reiterate.$.numIsNaN(0)).to.be(false);
      expect(reiterate.$.numIsNaN(-0)).to.be(false);
      expect(reiterate.$.numIsNaN(-4)).to.be(false);
      expect(reiterate.$.numIsNaN(4)).to.be(false);
      expect(reiterate.$.numIsNaN(4.5)).to.be(false);
      expect(reiterate.$.numIsNaN(required.MAX_VALUE)).to.be(false);
      expect(reiterate.$.numIsNaN(required.MIN_VALUE)).to.be(false);
    });

    it('Strings should be false', function () {
      expect(reiterate.$.numIsNaN('')).to.be(false);
      expect(reiterate.$.numIsNaN('hi')).to.be(false);
      expect(reiterate.$.numIsNaN('1.3')).to.be(false);
      expect(reiterate.$.numIsNaN('51')).to.be(false);
    });

    it('Booleans should be false', function () {
      expect(reiterate.$.numIsNaN(true)).to.be(false);
      expect(reiterate.$.numIsNaN(false)).to.be(false);
    });

    it('Functions should be false', function () {
      expect(reiterate.$.numIsNaN(reiterate.$.noop)).to.be(false);
    });

    it('Objects should be false', function () {
      expect(reiterate.$.numIsNaN({})).to.be(false);
      expect(reiterate.$.numIsNaN([])).to.be(false);
      expect(reiterate.$.numIsNaN(new RegExp('c'))).to.be(false);
      expect(reiterate.$.numIsNaN(new Date(2013, 11, 11))).to.be(false);
      expect(reiterate.$.numIsNaN(new Error('x'))).to.be(false);
    });

    it('Others should be false', function () {
      expect(reiterate.$.numIsNaN({
        valueOf: function () {
          return 3;
        }
      })).to.be(false);

      expect(reiterate.$.numIsNaN({
        valueOf: function () {
          return Infinity;
        }
      })).to.be(false);

      expect(reiterate.$.numIsNaN({
        valueOf: function () {
          throw 17;
        }
      })).to.be(false);

      expect(reiterate.$.numIsNaN({
        toString: function () {
          throw 17;
        }
      })).to.be(false);

      expect(reiterate.$.numIsNaN({
        valueOf: function () {
          throw 17;
        },

        toString: function () {
          throw 42;
        }
      })).to.be(false);
    });
  });
}());
