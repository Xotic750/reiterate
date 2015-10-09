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

  describe('Array.from', function () {
    it('should create correct array from iterable', function () {
      expect(reiterate.$.from(reiterate.$.returnArgs(0, 1, 2)))
        .to.eql([0, 1, 2]);

      expect(reiterate.$.from(required.create(null, undefined, 0.1248, -0, 0)))
        .to.eql(required.create(null, undefined, 0.1248, -0, 0));
    });

    it('should handle empty iterables correctly', function () {
      expect(reiterate.$.from(reiterate.$.returnArgs())).to.eql([]);
    });

    it('should work with other constructors', function () {
      var Foo = function (length, args) {
          /*jslint unparam: true */
          /*jshint unused: false */
          this.length = length;
        },
        args = ['a', 'b', 'c'],
        expected = new Foo(args.length);

      reiterate.$.forEach(args, function (arg, index) {
        expected[index] = arg;
      });

      expect(reiterate.$.from.call(Foo, args)).to.eql(expected);
    });

    it('supports a from function', function () {
      var original = [1, 2, 3],
        mapper = function (item) {
          return item * 2;
        },
        mapped = reiterate.$.from(original, mapper);

      expect(mapped).to.eql([2, 4, 6]);
    });

    it('throws when provided a nonfunction second arg', function () {
      expect(function () {
        reiterate.$.from([], false);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.from([], true);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.from([], /a/g);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.from([], {});
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.from([], []);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.from([], '');
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.from([], 3);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('supports a this arg', function () {
      var original = [1, 2, 3],
        context = {},
        mapper = function (item) {
          expect(this).to.equal(context);

          return item * 2;
        },
        mapped = reiterate.$.from(original, mapper, context);

      expect(mapped).to.eql([2, 4, 6]);
    });

    it('throws when provided null or undefined', function () {
      expect(function () {
        reiterate.$.from();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
      expect(function () {
        reiterate.$.from(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
      expect(function () {
        reiterate.$.from(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('returns [] when given 3', function () {
      expect(reiterate.$.from(3)).to.eql([]);
    });

    it('removes holes', function () {
      var input = required.create('[0, , 2]'),
        result = reiterate.$.from(input);

      expect(reiterate.$.hasProperty(input, 1)).not.to.be.ok();
      expect(reiterate.$.hasProperty(result, 1)).to.be.ok();
      expect(result).to.eql(required.create(0, undefined, 2));
    });

    if (required.isStrictMode()) {
      it('does not autobox the content in strict mode', function () {
        var actual;

        reiterate.$.from([1], function () {
          actual = this;
        }, 'x');

        expect(typeof actual).to.be('string');

        reiterate.$.from([1], function () {
          actual = this;
        });

        expect(actual).to.be(undefined);

        reiterate.$.from([1], function () {
          actual = this;
        }, undefined);

        expect(actual).to.be(undefined);

        reiterate.$.from([1], function () {
          actual = this;
        }, null);

        expect(actual).to.be(null);
      });
    }
  });
}());

/*jslint sloppy: true */
(function () {
  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.from', function () {
    it('does autobox the content in non-strict mode', function () {
      var actual;

      reiterate.$.from([1], function () {
        actual = this;
      }, 'x');

      expect(typeof actual).to.be('object');

      reiterate.$.from([1], function () {
        actual = this;
      });

      expect(actual).to.be(required.global);

      reiterate.$.from([1], function () {
        actual = this;
      }, undefined);

      expect(actual).to.be(required.global);

      reiterate.$.from([1], function () {
        actual = this;
      }, null);

      expect(actual).to.be(required.global);
    });
  });
}());
