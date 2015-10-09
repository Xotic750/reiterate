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

  describe('Object.keys', function () {
    /*jshint -W001 */
    var loopedValues = [
        'str',
        'obj',
        'arr',
        'bool',
        'num',
        'null',
        'undefined',
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],
      obj = {
        'str': 'boz',
        'obj': {},
        'arr': [],
        'bool': true,
        'num': 42,
        'null': null,
        'undefined': undefined,
        'toString': reiterate.$.noop,
        'toLocaleString': reiterate.$.noop,
        'valueOf': reiterate.$.noop,
        'hasOwnProperty': reiterate.$.noop,
        'isPrototypeOf': reiterate.$.noop,
        'propertyIsEnumerable': reiterate.$.noop,
        'constructor': reiterate.$.noop
      },
      keys = reiterate.$.keys(obj),
      loopedValues2 = [
        'str',
        'obj',
        'arr',
        'bool',
        'num',
        'null',
        'undefined'
      ],
      obj2 = {
        'str': 'boz',
        'obj': {},
        'arr': [],
        'bool': true,
        'num': 42,
        'null': null,
        'undefined': undefined
      },
      keys2 = reiterate.$.keys(obj2);
    /*jshint +W001 */

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.keys();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.keys(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.keys(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should not throw an TypeError if argument is primitive', function () {
      var primKeys;

      expect(function () {
        primKeys = reiterate.$.keys(42);
      }).to.not.throwException();

      expect(primKeys.length).to.be(0);

      expect(function () {
        primKeys = reiterate.$.keys(true);
      }).to.not.throwException();

      expect(primKeys.length).to.be(0);

      expect(function () {
        primKeys = reiterate.$.keys('abc');
      }).to.not.throwException();

      expect(primKeys.length).to.be(3);
    });

    it('should not throw an error in each case', function () {
      expect(keys.length).to.be(14);
      expect(reiterate.$.isArray(keys)).to.be.ok();
      reiterate.$.forEach(keys, function (name) {
        expect(Object.prototype.hasOwnProperty.call(obj, name)).to.be.ok();
      });

      reiterate.$.forEach(keys, function (name) {
        // should return names which are enumerable
        expect(reiterate.$.indexOf(loopedValues, name)).not.to.be(-1);
      });

      expect(keys2.length).to.be(7);
      expect(reiterate.$.isArray(keys2)).to.be.ok();
      reiterate.$.forEach(keys2, function (name) {
        expect(Object.prototype.hasOwnProperty.call(obj, name)).to.be.ok();
      });

      reiterate.$.forEach(keys2, function (name) {
        // should return names which are enumerable
        expect(reiterate.$.indexOf(loopedValues2, name)).not.to.be(-1);
      });
    });

    it('should work with arguments object', function () {
      var testValue = [0, 1],
        theArgs = reiterate.$.returnArgs(1, 2),
        theKeys;

      expect(function () {
        theKeys = reiterate.$.keys(theArgs);
      }).to.not.throwException();

      expect(theKeys.length).to.be(2);
      expect(theKeys).to.eql(testValue);
    });

    it('should work with string object', function () {
      var testValue = ['0', '1', '2'],
        theObj = Object('hej'),
        theKeys;

      expect(function () {
        theKeys = reiterate.$.keys(theObj);
      }).to.not.throwException();

      expect(theKeys).to.eql(testValue);
      expect(theKeys.length).to.be(3);
    });

    it('Constructor should not list prototype or constructor', function () {
      var pKeys;

      function Constructor() {
        this.constructor = this.prototype = 1;
      }

      Constructor.prototype.constructor = 1;

      expect(function () {
        pKeys = reiterate.$.keys(Constructor);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('Constructor prototype should not list constructor', function () {
      var pKeys;

      function Constructor() {
        this.constructor = this.prototype = 1;
      }

      Constructor.prototype.constructor = 1;

      expect(function () {
        pKeys = reiterate.$.keys(Constructor.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('should list prototype and constructor', function () {
      var pKeys;

      function Constructor() {
        this.constructor = this.prototype = 1;
      }

      Constructor.prototype.constructor = 1;

      expect(function () {
        pKeys = reiterate.$.keys(new Constructor());
      }).to.not.throwException();

      expect(pKeys.sort()).to.eql(['constructor', 'prototype']);
    });

    it('Object prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(Object.prototype);
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      expect(pKeys).to.eql([]);
    });

    it('Function prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(Function.prototype);
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      expect(pKeys).to.eql([]);
    });

    it('Boolean prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(Boolean.prototype);
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      expect(pKeys).to.eql([]);
    });

    it('String prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(String.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('Number prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(Number.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('Error prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(Error.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('TypeError prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(TypeError.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('SyntaxError prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(SyntaxError.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('RangeError prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(RangeError.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('EvalError prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(EvalError.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('URIError prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(URIError.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('ReferenceError prototypes should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(ReferenceError.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('Date prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(Date.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('RegExp prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(RegExp.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('should not enumerate over non-enumerable properties', function () {
      var Foo = function () {
          return;
        },
        pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(Foo.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });
  });
}());
