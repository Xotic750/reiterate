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

  describe('Array.push', function () {
    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.push();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.push(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.push(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('array', function () {
      var arrCmp = required.create(
          undefined,
          null, -1,
          0,
          1,
          false,
          true,
          undefined,
          '',
          'abc',
          null,
          undefined
        ),
        arr = [],
        i;

      expect(reiterate.$.push(arr, undefined)).to.be(1);
      expect(reiterate.$.push(arr, null)).to.be(2);
      expect(reiterate.$.push(arr, -1)).to.be(3);
      expect(reiterate.$.push(arr, 0)).to.be(4);
      expect(reiterate.$.push(arr, 1)).to.be(5);
      expect(reiterate.$.push(arr, false)).to.be(6);
      expect(reiterate.$.push(arr, true)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr, undefined)).to.be(8);
      expect(reiterate.$.push(arr, '')).to.be(9);
      expect(reiterate.$.push(arr, 'abc')).to.be(10);
      expect(reiterate.$.push(arr, null)).to.be(11);
      expect(reiterate.$.push(arr, undefined)).to.be(12);
      expect(arr.length).to.be(arrCmp.length);
      for (i = 0; i < arr.length; i += 1) {
        expect(Object.prototype.hasOwnProperty.call(arr, i)).to.be.ok();
        expect(arr[i]).to.be(arrCmp[i]);
      }

      expect(arr).to.eql(arrCmp);
    });

    it('arguments', function () {
      var arrCmp = required.create(
          undefined,
          null, -1,
          0,
          1,
          false,
          true,
          undefined,
          '',
          'abc',
          null,
          undefined
        ),
        arr = reiterate.$.returnArgs(),
        i;

      expect(reiterate.$.push(arr, undefined)).to.be(1);
      expect(reiterate.$.push(arr, null)).to.be(2);
      expect(reiterate.$.push(arr, -1)).to.be(3);
      expect(reiterate.$.push(arr, 0)).to.be(4);
      expect(reiterate.$.push(arr, 1)).to.be(5);
      expect(reiterate.$.push(arr, false)).to.be(6);
      expect(reiterate.$.push(arr, true)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr, undefined)).to.be(8);
      expect(reiterate.$.push(arr, '')).to.be(9);
      expect(reiterate.$.push(arr, 'abc')).to.be(10);
      expect(reiterate.$.push(arr, null)).to.be(11);
      expect(reiterate.$.push(arr, undefined)).to.be(12);
      expect(arr.length).to.be(arrCmp.length);
      for (i = 0; i < arr.length; i += 1) {
        expect(Object.prototype.hasOwnProperty.call(arr, i)).to.be.ok();
        expect(arr[i]).to.be(arrCmp[i]);
      }

      expect(reiterate.$.chop(arr)).to.eql(arrCmp);
    });

    it('object with length', function () {
      var arrCmp = {
          0: undefined,
          1: null,
          2: -1,
          3: 0,
          4: 1,
          5: false,
          6: true,
          7: undefined,
          8: '',
          9: 'abc',
          10: null,
          11: undefined,
          length: 12
        },
        arr = {
          length: 0
        },
        i;

      expect(reiterate.$.push(arr, undefined)).to.be(1);
      expect(reiterate.$.push(arr, null)).to.be(2);
      expect(reiterate.$.push(arr, -1)).to.be(3);
      expect(reiterate.$.push(arr, 0)).to.be(4);
      expect(reiterate.$.push(arr, 1)).to.be(5);
      expect(reiterate.$.push(arr, false)).to.be(6);
      expect(reiterate.$.push(arr, true)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr, undefined)).to.be(8);
      expect(reiterate.$.push(arr, '')).to.be(9);
      expect(reiterate.$.push(arr, 'abc')).to.be(10);
      expect(reiterate.$.push(arr, null)).to.be(11);
      expect(reiterate.$.push(arr, undefined)).to.be(12);
      expect(arr.length).to.be(arrCmp.length);
      for (i = 0; i < arr.length; i += 1) {
        expect(Object.prototype.hasOwnProperty.call(arr, i)).to.be.ok();
        expect(arr[i]).to.be(arrCmp[i]);
      }

      expect(arr).to.eql(arrCmp);
    });

    it('object without length', function () {
      var arrCmp = {
          0: undefined,
          1: null,
          2: -1,
          3: 0,
          4: 1,
          5: false,
          6: true,
          7: undefined,
          8: '',
          9: 'abc',
          10: null,
          11: undefined,
          length: 12
        },
        arr = {},
        i;

      expect(reiterate.$.push(arr, undefined)).to.be(1);
      expect(reiterate.$.push(arr, null)).to.be(2);
      expect(reiterate.$.push(arr, -1)).to.be(3);
      expect(reiterate.$.push(arr, 0)).to.be(4);
      expect(reiterate.$.push(arr, 1)).to.be(5);
      expect(reiterate.$.push(arr, false)).to.be(6);
      expect(reiterate.$.push(arr, true)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr, undefined)).to.be(8);
      expect(reiterate.$.push(arr, '')).to.be(9);
      expect(reiterate.$.push(arr, 'abc')).to.be(10);
      expect(reiterate.$.push(arr, null)).to.be(11);
      expect(reiterate.$.push(arr, undefined)).to.be(12);
      expect(arr.length).to.be(arrCmp.length);
      for (i = 0; i < arr.length; i += 1) {
        expect(Object.prototype.hasOwnProperty.call(arr, i)).to.be.ok();
        expect(arr[i]).to.be(arrCmp[i]);
      }

      expect(arr).to.eql(arrCmp);
    });
  });
}());
