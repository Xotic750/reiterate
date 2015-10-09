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

  describe('Object.assign', function () {
    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.assign();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.assign(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.assign(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if source argument is undefined', function () {
      expect(function () {
        reiterate.$.assign({}, undefined);
      }).to.not.throwException();
    });

    it('should throw if source argument is null', function () {
      expect(function () {
        reiterate.$.assign({}, null);
      }).to.not.throwException();
    });

    it('returns the modified target object', function () {
      var target = {},
        returned = reiterate.$.assign(target, {
          a: 1
        });

      expect(returned).to.equal(target);
    });

    it('should return target if no sources', function () {
      var target = {};

      expect(reiterate.$.assign(target)).to.be(target);
    });

    it('should merge two objects', function () {
      var target = {
          a: 1
        },
        returned = reiterate.$.assign(target, {
          b: 2
        });

      expect(returned).to.eql({
        a: 1,
        b: 2
      });
    });

    it('should merge three objects', function () {
      var target = {
          a: 1
        },
        source1 = {
          b: 2
        },
        source2 = {
          c: 3
        },
        returned = reiterate.$.assign(target, source1, source2);

      expect(returned).to.eql({
        a: 1,
        b: 2,
        c: 3
      });
    });

    it('only iterates over own keys', function () {
      var Foo = function () {
          return;
        },
        target = {
          a: 1
        },
        foo,
        returned;

      Foo.prototype.bar = true;
      foo = new Foo();
      foo.baz = true;
      returned = reiterate.$.assign(target, foo);
      expect(returned).to.equal(target);
      expect(target).to.eql({
        baz: true,
        a: 1
      });
    });

    it('works with arrays', function () {
      var x = required.create(undefined, undefined, undefined, {}, 4, 5, 6),
        y = required.create(1, null, undefined, {}, 4, 5, 6);

      delete x[0];
      delete x[1];
      delete x[2];
      expect(reiterate.$.assign([1, 2, 3], x)).to.eql([1, 2, 3, {}, 4, 5, 6]);
      expect(reiterate.$.assign([1, 2, 3], y)).to.eql(y);

      expect(reiterate.$.assign([1, 2, 3], {
        3: 4,
        4: 5,
        5: 6,
        length: 6
      })).to.eql([1, 2, 3, 4, 5, 6]);

      expect(reiterate.$.assign([1, 2, 3, 6, 7, 8, 9], {
        3: 4,
        4: 5,
        5: 6,
        length: 6
      })).to.eql([1, 2, 3, 4, 5, 6]);

      expect(reiterate.$.assign([1, 2, 3, 6, 7, 8, 9], {
        3: 4,
        4: 5,
        5: 6
      })).to.eql([1, 2, 3, 4, 5, 6, 9]);
    });

    it('should not throw when target is not an object', function () {
      expect(function () {
        reiterate.$.assign(true, {});
      }).to.not.throwException();

      expect(function () {
        reiterate.$.assign(1, {});
      }).to.not.throwException();

      expect(function () {
        reiterate.$.assign('a', {});
      }).to.not.throwException();
    });

    it('should not throw when source is not an object', function () {
      var target = {};

      expect(function () {
        reiterate.$.assign(target, true);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.assign(target, 1);
      }).to.not.throwException();
      expect(function () {
        reiterate.$.assign(target, 'a');
      }).to.not.throwException();
    });
  });
}());
