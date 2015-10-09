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

  describe('Object.hasProperty', function () {
    it('object, enumerable bugged properties', function () {
      var testObj = [];

      expect(reiterate.$.hasProperty(testObj, 'toString')).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'toLocaleString')).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'valueOf')).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'hasOwnProperty')).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'isPrototypeOf')).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'propertyIsEnumerable'))
        .to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'constructor')).to.be.ok();
    });

    it('array, enumerable bugged properties', function () {
      var testArr = [];

      expect(reiterate.$.hasProperty(testArr, 'toString')).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'toLocaleString')).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'valueOf')).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'hasOwnProperty')).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'isPrototypeOf')).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'propertyIsEnumerable'))
        .to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'constructor')).to.be.ok();
    });

    it('function prototype property', function () {
      expect(reiterate.$.hasProperty(function () {
        return;
      }, 'prototype')).to.be.ok();
    });

    it('string index, literal and object', function () {
      var testStr = 'abc',
        testObj = Object(testStr);

      expect(reiterate.$.hasProperty(testStr, 0)).to.be.ok();
      expect(reiterate.$.hasProperty(testStr, 3)).to.not.be.ok();
      expect(reiterate.$.hasProperty(testObj, 0)).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 3)).to.not.be.ok();
    });

    it('array index', function () {
      var testArr = ['a', 'b', 'c'];

      expect(reiterate.$.hasProperty(testArr, 0)).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 3)).to.not.be.ok();
    });

    it('arguments index', function () {
      var testArg = reiterate.$.returnArgs('a', 'b', 'c');

      expect(reiterate.$.hasProperty(testArg, 0)).to.be.ok();
      expect(reiterate.$.hasProperty(testArg, 3)).to.not.be.ok();
    });

    it('array prototype methods', function () {
      var testArr = [];

      expect(reiterate.$.hasProperty(testArr, 'push')).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'pop')).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'foo')).to.not.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'bar')).to.not.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'fuz')).to.not.be.ok();
    });

    it('object direct properties', function () {
      var testObj = {
        foo: undefined,
        bar: null
      };

      if (testObj.getPrototypeOf) {
        expect(reiterate.$.hasProperty(testObj, 'getPrototypeOf')).to.be.ok();
      }

      expect(reiterate.$.hasProperty(testObj, 'foo')).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'bar')).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'fuz')).to.not.be.ok();
    });
  });
}());
