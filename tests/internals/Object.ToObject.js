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

  describe('Object.toObject', function () {
    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.toObject();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.toObject(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.toObject(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should not throw an error in each case', function () {
      expect(typeof reiterate.$.toObject(1)).to.be('object');
      expect(typeof reiterate.$.toObject(true)).to.be('object');
      expect(typeof reiterate.$.toObject('')).to.be('object');
      expect(typeof reiterate.$.toObject([])).to.be('object');
      expect(typeof reiterate.$.toObject({})).to.be('object');
      expect(typeof reiterate.$.toObject(Object('a'))).to.be('object');
      expect(typeof reiterate.$.toObject(reiterate.$.noop)).to.be('function');
      expect(typeof reiterate.$.toObject(new Date())).to.be('object');
      expect(reiterate.$.toObject(new RegExp('c')).toString()).to.be('/c/');
    });

    it('should have correct values', function () {
      var str = reiterate.$.toObject('foo');

      expect(typeof str).to.be('object');
      expect(str.length).to.be(3);
      expect(reiterate.$.toStringTag(str)).to.be('[object String]');
      expect(str.toString()).to.be('foo');
      expect(str.charAt(0)).to.be('f');
      expect(str.charAt(1)).to.be('o');
      expect(str.charAt(2)).to.be('o');
    });

    it('should be same object', function () {
      var testObject = [];

      expect(reiterate.$.toObject(testObject)).to.be(testObject);
      testObject = {};
      expect(reiterate.$.toObject(testObject)).to.be(testObject);
      testObject = reiterate.$.noop;
      expect(reiterate.$.toObject(testObject)).to.be(testObject);
      testObject = Object('test');
      expect(reiterate.$.toObject(testObject)).to.be(testObject);
      testObject = Object(true);
      expect(reiterate.$.toObject(testObject)).to.be(testObject);
      testObject = Object(10);
      expect(reiterate.$.toObject(testObject)).to.be(testObject);
    });
  });
}());
