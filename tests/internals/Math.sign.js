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

  describe('Math.sign', function () {
    it('should not throw an error in each case', function () {
      var x = reiterate.$.sign();

      expect(reiterate.$.numIsNaN(x)).to.be.ok();
      x = reiterate.$.sign(undefined);
      expect(reiterate.$.numIsNaN(reiterate.$.sign(undefined))).to.be.ok();
      x = reiterate.$.sign(null);
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();

      expect(reiterate.$.sign(-1)).to.be(-1);

      x = reiterate.$.sign(+0);
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();
      x = reiterate.$.sign('0');
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();
      x = reiterate.$.sign('+0');
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();
      x = reiterate.$.sign(-0);
      expect(typeof x === 'number' && x === 0 && 1 / x === -Infinity)
        .to.be.ok();
      x = reiterate.$.sign('-0');
      expect(typeof x === 'number' && x === 0 && 1 / x === -Infinity)
        .to.be.ok();

      expect(reiterate.$.sign(1)).to.be(1);
      expect(reiterate.$.sign(Infinity)).to.be(1);
      expect(reiterate.$.sign(-Infinity)).to.be(-1);

      x = reiterate.$.sign(NaN);
      expect(reiterate.$.numIsNaN(x)).to.be.ok();
      x = reiterate.$.sign('NaN');
      expect(reiterate.$.numIsNaN(x)).to.be.ok();
      x = reiterate.$.sign('');
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();
      x = reiterate.$.sign(' ');
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();

      expect(reiterate.$.sign(true)).to.be(1);

      x = reiterate.$.sign(false);
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();
      x = reiterate.$.sign(reiterate.$.noop);
      expect(reiterate.$.numIsNaN(x)).to.be.ok();
      x = reiterate.$.sign({});
      expect(reiterate.$.numIsNaN(x)).to.be.ok();
      x = reiterate.$.sign([]);
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();
      x = reiterate.$.sign(new RegExp('c'));
      expect(reiterate.$.numIsNaN(x)).to.be.ok();

      expect(reiterate.$.sign(new Date(2013, 11, 11))).to.be(1);

      x = reiterate.$.sign(new Error('x'));
      expect(reiterate.$.numIsNaN(x)).to.be.ok();

      // we also verify that [[toNumber]] is being called
      reiterate.$.forEach([Infinity, 1], function (value) {
        expect(reiterate.$.sign(value)).to.be(1);
        expect(reiterate.$.sign(value.toString())).to.be(1);
      });

      expect(reiterate.$.sign(true)).to.be(1);
      reiterate.$.forEach([-Infinity, -1], function (value) {
        expect(reiterate.$.sign(value)).to.be(-1);
        expect(reiterate.$.sign(value.toString())).to.be(-1);
      });
    });
  });
}());
