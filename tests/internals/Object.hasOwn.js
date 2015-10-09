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

  describe('Object.hasOwnProperty', function () {
    /*jshint -W001 */
    var obj = {
        'toString': reiterate.$.noop,
        'toLocaleString': reiterate.$.noop,
        'valueOf': reiterate.$.noop,
        'hasOwnProperty': reiterate.$.noop,
        'isPrototypeOf': reiterate.$.noop,
        'propertyIsEnumerable': reiterate.$.noop,
        'constructor': reiterate.$.noop
      },
      obj2 = {};
    /*jshint +W001 */

    it('defined on object "toString"', function () {
      expect(reiterate.$.hasOwn(obj, 'toString')).to.be.ok();
    });

    it('defined on object "toLocaleString"', function () {
      expect(reiterate.$.hasOwn(obj, 'toLocaleString')).to.be.ok();
    });

    it('defined on object "valueOf"', function () {
      expect(reiterate.$.hasOwn(obj, 'valueOf')).to.be.ok();
    });

    it('defined on object "hasOwnProperty"', function () {
      expect(reiterate.$.hasOwn(obj, 'hasOwnProperty')).to.be.ok();
    });

    it('defined on object "isPrototypeOf"', function () {
      expect(reiterate.$.hasOwn(obj, 'isPrototypeOf')).to.be.ok();
    });

    it('defined on object "propertyIsEnumerable"', function () {
      expect(reiterate.$.hasOwn(obj, 'propertyIsEnumerable')).to.be.ok();
    });

    it('defined on object "constructor"', function () {
      expect(reiterate.$.hasOwn(obj, 'constructor')).to.be.ok();
    });

    it('properties that are not defined', function () {
      expect(reiterate.$.hasOwn(obj, 'foo')).to.not.be.ok();
      expect(reiterate.$.hasOwn(obj, 'bar')).to.not.be.ok();
      expect(reiterate.$.hasOwn(obj, 'fuz')).to.not.be.ok();
    });

    it('not defined on object "toString"', function () {
      expect(reiterate.$.hasOwn(obj2, 'toString')).to.not.be.ok();
    });

    it('not defined on object "toLocaleString"', function () {
      expect(reiterate.$.hasOwn(obj2, 'toLocaleString')).to.not.be.ok();
    });

    it('not defined on object "valueOf"', function () {
      expect(reiterate.$.hasOwn(obj2, 'valueOf')).to.not.be.ok();
    });

    it('not defined on object "hasOwnProperty"', function () {
      expect(reiterate.$.hasOwn(obj2, 'hasOwnProperty')).to.not.be.ok();
    });

    it('not defined on object "isPrototypeOf"', function () {
      expect(reiterate.$.hasOwn(obj2, 'isPrototypeOf')).to.not.be.ok();
    });

    it('not defined on object "propertyIsEnumerable"', function () {
      expect(reiterate.$.hasOwn(obj2, 'propertyIsEnumerable')).to.not.be.ok();
    });

    it('not defined on object "constructor"', function () {
      expect(reiterate.$.hasOwn(obj2, 'constructor')).to.not.be.ok();
    });

    it('not defined on object should be not ok in each case', function () {
      expect(reiterate.$.hasOwn(obj2, 'foo')).to.not.be.ok();
      expect(reiterate.$.hasOwn(obj2, 'bar')).to.not.be.ok();
      expect(reiterate.$.hasOwn(obj2, 'fuz')).to.not.be.ok();
    });

    it('defined on object with "undefined" value "toString"', function () {
      expect(reiterate.$.hasOwn({
        toString: undefined
      }, 'toString')).to.be.ok();
    });

    it('defined on object with "undefined" value "toLocaleString"', function () {
      expect(reiterate.$.hasOwn({
        toLocaleString: undefined
      }, 'toLocaleString')).to.be.ok();
    });

    it('defined on object with "undefined" value "valueOf"', function () {
      expect(reiterate.$.hasOwn({
        valueOf: undefined
      }, 'valueOf')).to.be.ok();
    });

    it('defined on object with "undefined" value "hasOwnProperty"', function () {
      /*jshint -W001 */
      expect(reiterate.$.hasOwn({
        hasOwnProperty: undefined
      }, 'hasOwnProperty')).to.be.ok();
      /*jshint +W001 */
    });

    it('defined on object with "undefined" value "isPrototypeOf"', function () {
      expect(reiterate.$.hasOwn({
        isPrototypeOf: undefined
      }, 'isPrototypeOf')).to.be.ok();
    });

    it(
      'defined on object with "undefined" value "propertyIsEnumerable"',
      function () {
        expect(reiterate.$.hasOwn({
          propertyIsEnumerable: undefined
        }, 'propertyIsEnumerable')).to.be.ok();
      }
    );

    it('defined on object with "undefined" value "constructor"', function () {
      expect(reiterate.$.hasOwn({
        constructor: undefined
      }, 'constructor')).to.be.ok();
    });

    it('string defined', function () {
      var str = 'abc';

      expect(reiterate.$.hasOwn(str, '0')).to.be.ok();
      expect(reiterate.$.hasOwn(str, '1')).to.be.ok();
      expect(reiterate.$.hasOwn(str, '2')).to.be.ok();
    });

    it('string not-defined', function () {
      var str = 'abc';

      expect(reiterate.$.hasOwn(str, '3')).to.not.be.ok();
    });

    it('string object defined', function () {
      var strObj = Object('abc');

      expect(reiterate.$.hasOwn(strObj, '0')).to.be.ok();
      expect(reiterate.$.hasOwn(strObj, '1')).to.be.ok();
      expect(reiterate.$.hasOwn(strObj, '2')).to.be.ok();
    });

    it('string object not-defined', function () {
      var strObj = Object('abc');

      expect(reiterate.$.hasOwn(strObj, '3')).to.not.be.ok();
    });

    it('arguments defined', function () {
      var args = reiterate.$.returnArgs(false, undefined, null, '', 0);

      expect(reiterate.$.hasOwn(args, '0')).to.be.ok();
      expect(reiterate.$.hasOwn(args, '1')).to.be.ok();
      expect(reiterate.$.hasOwn(args, '2')).to.be.ok();
      expect(reiterate.$.hasOwn(args, '3')).to.be.ok();
      expect(reiterate.$.hasOwn(args, '4')).to.be.ok();
    });

    it('arguments not-defined', function () {
      var args = reiterate.$.returnArgs(false, undefined, null, '', 0);

      expect(reiterate.$.hasOwn(args, '5')).to.not.be.ok();
    });

    it('should not list prototype or constructor', function () {
      function Constructor() {
        this.constructor = this.prototype = 1;
      }

      Constructor.prototype.constructor = 1;
      expect(reiterate.$.hasOwn(Constructor, 'constructor')).to.not.be.ok();
    });

    it('should list prototype and constructor', function () {
      function Constructor() {
        this.constructor = this.prototype = 1;
      }

      Constructor.prototype.constructor = 1;
      expect(reiterate.$.hasOwn(Constructor, 'prototype')).to.be.ok();
      expect(reiterate.$.hasOwn(Constructor.prototype, 'constructor'))
        .to.be.ok();
      expect(reiterate.$.hasOwn(new Constructor(), 'prototype')).to.be.ok();
      expect(reiterate.$.hasOwn(new Constructor(), 'constructor')).to.be.ok();
    });
  });
}());
