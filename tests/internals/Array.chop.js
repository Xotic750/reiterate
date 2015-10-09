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

  describe('Array.chop', function () {
    var arr = required.create(
        undefined,
        null,
        1,
        'a',
        2,
        'b',
        null,
        undefined
      ),
      testValue;

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.chop();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.chop(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.chop(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should not throw an error in each case', function () {
      expect(reiterate.$.chop(arr)).to.eql(arr);
      expect(reiterate.$.chop(arr, undefined, undefined)).to.eql(arr);

      testValue = required.create(undefined);
      expect(reiterate.$.chop(arr, -1)).to.eql(testValue);
      expect(reiterate.$.chop(arr, -1).length).to.be(1);
      expect(reiterate.$.chop(arr, 0)).to.eql(arr);

      testValue = required.create('a', 2, 'b', null, undefined);
      expect(reiterate.$.chop(arr, 3)).to.eql(testValue);
      expect(reiterate.$.chop(arr, -1, 4)).to.eql([]);
      expect(reiterate.$.chop(arr, -1, 4).length).to.be(0);

      testValue = required.create(undefined, null, 1, 'a');
      expect(reiterate.$.chop(arr, 0, 4)).to.eql(testValue);

      testValue = ['a', 2, 'b'];
      expect(reiterate.$.chop(arr, 3, 6)).to.eql(testValue);
    });

    it('should work with objects that have length', function () {
      var obj = required.array2Object(arr);

      expect(reiterate.$.chop(obj)).to.eql(arr);
      expect(reiterate.$.chop(obj, undefined, undefined)).to.eql(arr);

      testValue = required.create(undefined);
      expect(reiterate.$.chop(obj, -1)).to.eql(testValue);
      expect(reiterate.$.chop(obj, -1).length).to.be(1);
      expect(reiterate.$.chop(obj, 0)).to.eql(arr);

      testValue = required.create('a', 2, 'b', null, undefined);
      expect(reiterate.$.chop(obj, 3)).to.eql(testValue);
      expect(reiterate.$.chop(obj, -1, 4)).to.eql([]);
      expect(reiterate.$.chop(obj, -1, 4).length).to.be(0);

      testValue = required.create(undefined, null, 1, 'a');
      expect(reiterate.$.chop(obj, 0, 4)).to.eql(testValue);

      testValue = ['a', 2, 'b'];
      expect(reiterate.$.chop(obj, 3, 6)).to.eql(testValue);
    });

    it('should work with arguments', function () {
      var obj = reiterate.$.returnArgs(
        undefined,
        null,
        1,
        'a',
        2,
        'b',
        null,
        undefined
      );

      expect(reiterate.$.chop(obj)).to.eql(arr);
      expect(reiterate.$.chop(obj, undefined, undefined)).to.eql(arr);

      testValue = required.create(undefined);
      expect(reiterate.$.chop(obj, -1)).to.eql(testValue);
      expect(reiterate.$.chop(obj, -1).length).to.be(1);
      expect(reiterate.$.chop(obj, 0)).to.eql(arr);

      testValue = required.create('a', 2, 'b', null, undefined);
      expect(reiterate.$.chop(obj, 3)).to.eql(testValue);
      expect(reiterate.$.chop(obj, -1, 4), []).to.eql([]);
      expect(reiterate.$.chop(obj, -1, 4).length).to.be(0);

      testValue = required.create(undefined, null, 1, 'a');
      expect(reiterate.$.chop(obj, 0, 4)).to.eql(testValue);

      testValue = ['a', 2, 'b'];
      expect(reiterate.$.chop(obj, 3, 6)).to.eql(testValue);
    });

    it('should work with string', function () {
      var obj = '1234567890';

      expect(reiterate.$.chop(obj)).to.eql([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0'
      ]);
      expect(reiterate.$.chop(obj, undefined, undefined))
        .to.eql(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);

      expect(reiterate.$.chop(obj, -1)).to.eql(['0']);
      expect(reiterate.$.chop(obj, -1).length).to.be(1);
      expect(reiterate.$.chop(obj, 0)).to.eql([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0'
      ]);

      testValue = required.create('a', 2, 'b', null, undefined);
      expect(reiterate.$.chop(obj, 3)).to.eql([
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0'
      ]);
      expect(reiterate.$.chop(obj, -1, 4), []).to.eql([]);
      expect(reiterate.$.chop(obj, -1, 4).length).to.be(0);

      testValue = required.create(undefined, null, 1, 'a');
      expect(reiterate.$.chop(obj, 0, 4)).to.eql(['1', '2', '3', '4']);

      testValue = ['a', 2, 'b'];
      expect(reiterate.$.chop(obj, 3, 6)).to.eql(['4', '5', '6']);
    });
  });
}());
