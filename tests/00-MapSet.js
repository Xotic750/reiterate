/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, es3:true, plusplus:true, maxparams:3, maxdepth:2,
    maxstatements:29, maxcomplexity:3
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject,
    MapObject = reiterate.$.Map,
    SetObject = reiterate.$.Set;

  describe('Basic tests', function () {
    var proto = '__proto__';

    it('MapObject existence', function () {
      expect(MapObject).to.be.ok();
    });

    it('MapObject constructor behavior', function () {
      expect(new MapObject()).to.be.a(MapObject);
      var a = 1,
        b = {},
        c = new MapObject(),
        m = new MapObject([
          [1, 1],
          [b, 2],
          [c, 3]
        ]);

      expect(m.has(a)).to.be.ok();
      expect(m.has(b)).to.be.ok();
      expect(m.has(c)).to.be.ok();
      expect(m.size).to.be(3);
      if (proto in {}) {
        expect(new MapObject()[proto].isPrototypeOf(new MapObject()))
          .to.be.ok();
        expect(new MapObject()[proto]).to.be(MapObject.prototype);
      }
    });

    it('MapObject#size - Mozilla only', function () {
      var o = new MapObject();

      if ('size' in o) {
        expect(o.size).to.be(0);
        o.set('a', 'a');
        expect(o.size).to.be(1);
        o['delete']('a');
        expect(o.size).to.be(0);
      }
    });

    it('MapObject#has', function () {
      var o = new MapObject(),
        generic = {},
        callback = function () {};

      expect(o.has(callback)).to.not.be.ok();
      o.set(callback, generic);
      expect(o.has(callback)).to.be.ok();
    });

    it('MapObject#get', function () {
      var o = new MapObject(),
        generic = {},
        callback = function () {};

      //:was assert(o.get(callback, 123) === 123);
      o.set(callback, generic);
      expect(o.get(callback, 123)).to.be(generic);
      expect(o.get(callback)).to.be(generic);
    });

    it('MapObject#set', function () {
      var o = new MapObject(),
        generic = {},
        callback = function () {};

      o.set(callback, generic);
      expect(o.get(callback)).to.be(generic);
      o.set(callback, callback);
      expect(o.get(callback)).to.be(callback);
      o.set(callback, o);
      expect(o.get(callback)).to.be(o);
      o.set(o, callback);
      expect(o.get(o)).to.be(callback);
      o.set(NaN, generic);
      expect(o.has(NaN)).to.be.ok();
      expect(o.get(NaN)).to.be(generic);
      o.set('key', undefined);
      expect(o.has('key')).to.be.ok();
      expect(o.get('key')).to.be(undefined);

      expect(!o.has(-0)).to.be.ok();
      expect(!o.has(0)).to.be.ok();
      o.set(-0, callback);
      expect(o.has(-0)).to.be.ok();
      expect(o.has(0)).to.be.ok();
      expect(o.get(-0)).to.be(callback);
      expect(o.get(0)).to.be(callback);
      o.set(0, generic);
      expect(o.has(-0)).to.be.ok();
      expect(o.has(0)).to.be.ok();
      expect(o.get(-0)).to.be(generic);
      expect(o.get(0)).to.be(generic);
    });

    it("MapObject#['delete']", function () {
      var o = new MapObject(),
        generic = {},
        callback = function () {};

      o.set(callback, generic);
      o.set(generic, callback);
      o.set(o, callback);
      expect(o.has(callback) && o.has(generic) && o.has(o)).to.be.ok();
      o['delete'](callback);
      o['delete'](generic);
      o['delete'](o);
      expect(!o.has(callback) && !o.has(generic) && !o.has(o)).to.be.ok();
      expect(o['delete'](o)).to.not.be.ok();
      o.set(o, callback);
      expect(o['delete'](o)).to.be.ok();
    });

    it('non object key does not throw an error', function () {
      var o = new MapObject();

      try {
        o.set('key', o);
      } catch (emAll) {
        expect(false).to.be.ok();
      }
    });

    it('keys, values, entries behavior', function () {
      // test that things get returned in insertion order as per the specs
      var o = new MapObject([
          ['1', 1],
          ['2', 2],
          ['3', 3]
        ]),
        keys = o.keys(),
        values = o.values(),
        k = keys.next(),
        v = values.next(),
        e;

      expect(k.value === '1' && v.value === 1).to.be.ok();
      o['delete']('2');
      k = keys.next();
      v = values.next();
      expect(k.value === '3' && v.value === 3).to.be.ok();
      // insertion of previously-removed item goes to the end
      o.set('2', 2);
      k = keys.next();
      v = values.next();
      expect(k.value === '2' && v.value === 2).to.be.ok();
      // when called again, new iterator starts from beginning
      var entriesagain = o.entries();

      expect(entriesagain.next().value[0]).to.be('1');
      expect(entriesagain.next().value[0]).to.be('3');
      expect(entriesagain.next().value[0]).to.be('2');
      // after a iterator is finished, don't return any more elements
      k = keys.next();
      v = values.next();
      expect(k.done && v.done).to.be.ok();
      k = keys.next();
      v = values.next();
      expect(k.done && v.done).to.be.ok();
      o.set('4', 4);
      k = keys.next();
      v = values.next();
      expect(k.done && v.done).to.be.ok();
      // new element shows up in iterators that didn't yet
      e = entriesagain.next();
      expect(e.done).to.not.be.ok();
      expect(e.value[0]).to.be('4');
      expect(entriesagain.next().done).to.be.ok();
    });

    it('MapObject#forEach', function () {
      var o = new MapObject();

      o.set('key 0', 0);
      o.set('key 1', 1);
      o.forEach(function (value, key, obj) {
        expect('key ' + value).to.be(key);
        expect(obj).to.be(o);
        // even if dropped, keeps looping
        o['delete'](key);
      });

      expect(!o.size).to.be.ok();
    });

    it('MapObject#forEach with mutations', function () {
      var o = new MapObject([
          ['0', 0],
          ['1', 1],
          ['2', 2]
        ]),
        seen = [];

      o.forEach(function (value, key, obj) {
        seen.push(value);
        expect(obj).to.be(o);
        expect('' + value).to.be(key);
        // mutations work as expected
        if (value === 1) {
          o['delete']('0'); // remove from before current index
          o['delete']('2'); // remove from after current index
          o.set('3', 3); // insertion
        } else if (value === 3) {
          o.set('0', 0); // insertion at the end
        }
      });

      expect(seen).to.eql([0, 1, 3, 0]);
    });

    it('MapObject#clear', function () {
      var o = new MapObject();

      o.set(1, '1');
      o.set(2, '2');
      o.set(3, '3');
      o.clear();
      expect(!o.size).to.be.ok();
    });

    it('SetObject existence', function () {
      expect(SetObject).to.be.ok();
    });

    it('SetObject constructor behavior', function () {
      expect(new SetObject()).to.be.a(SetObject);
      var s = new SetObject([1, 2]);

      expect(s.has(1)).to.be.ok();
      expect(s.has(2)).to.be.ok();
      expect(s.size).to.be(2);
      if (proto in {}) {
        expect(new SetObject()[proto].isPrototypeOf(new SetObject()))
          .to.be.ok();
        expect(new SetObject()[proto]).to.be(SetObject.prototype);
      }
    });

    it('SetObject#size - Mozilla only', function () {
      var o = new SetObject();

      if ('size' in o) {
        expect(o.size).to.be(0);
        o.add('a');
        expect(o.size).to.be(1);
        o['delete']('a');
        expect(o.size).to.be(0);
      }
    });

    it('SetObject#add', function () {
      var o = new SetObject();

      expect(o.add(NaN)).to.be.ok();
      expect(o.has(NaN)).to.be.ok();
    });

    it("SetObject#['delete']", function () {
      var o = new SetObject(),
        generic = {},
        callback = function () {};

      o.add(callback);
      o.add(generic);
      o.add(o);
      expect(o.has(callback) && o.has(generic) && o.has(o)).to.be.ok();
      o['delete'](callback);
      o['delete'](generic);
      o['delete'](o);
      expect(!o.has(callback) && !o.has(generic) && !o.has(o)).to.be.ok();
      expect(o['delete'](o)).to.not.be.ok();
      o.add(o);
      expect(o['delete'](o)).to.be.ok();
    });

    it('values behavior', function () {
      // test that things get returned in insertion order as per the specs
      var o = new SetObject([1, 2, 3]);

      expect(o.keys).to.be(o.values); // same function, as per the specs
      var values = o.values(),
        v = values.next();

      expect(v.value).to.be(1);
      o['delete'](2);
      v = values.next();
      expect(v.value).to.be(3);
      // insertion of previously-removed item goes to the end
      o.add(2);
      v = values.next();
      expect(v.value).to.be(2);
      // when called again, new iterator starts from beginning
      var entriesagain = o.entries();
      expect(entriesagain.next().value[1]).to.be(1);
      expect(entriesagain.next().value[1]).to.be(3);
      expect(entriesagain.next().value[1]).to.be(2);
      // after a iterator is finished, don't return any more elements
      v = values.next();
      expect(v.done).to.be.ok();
      v = values.next();
      expect(v.done).to.be.ok();
      o.add(4);
      v = values.next();
      expect(v.done).to.be.ok();
      // new element shows up in iterators that didn't yet finish
      expect(entriesagain.next().value[1]).to.be(4);
      expect(entriesagain.next().done).to.be.ok();
    });

    it('SetObject#has', function () {
      var o = new SetObject(),
        callback = function () {};

      expect(o.has(callback)).to.not.be.ok();
      o.add(callback);
      expect(o.has(callback)).to.be.ok();
    });

    it('SetObject#forEach', function () {
      var o = new SetObject(),
        i = 0;

      o.add('value 0');
      o.add('value 1');
      o.forEach(function (value, sameValue, obj) {
        expect('value ' + i).to.be(value);
        i += 1;
        expect(obj).to.be(o);
        expect(sameValue).to.be(value);
        // even if dropped, keeps looping
        o['delete'](value);
      });

      expect(!o.size).to.be.ok();
    });

    it('SetObject#forEach with mutations', function () {
      var o = new SetObject([0, 1, 2]),
        seen = [];

      o.forEach(function (value, sameValue, obj) {
        seen.push(value);
        expect(obj).to.be(o);
        expect(sameValue).to.be(value);
        // mutations work as expected
        if (value === 1) {
          o['delete'](0); // remove from before current index
          o['delete'](2); // remove from after current index
          o.add(3); // insertion
        } else if (value === 3) {
          o.add(0); // insertion at the end
        }
      });

      expect(seen).to.eql([0, 1, 3, 0]);
    });

    it('SetObject#clear', function () {
      var o = new SetObject();

      o.add(1);
      o.add(2);
      o.clear();
      expect(!o.size).to.be.ok();
    });

    it('Set#add, Map#set are chainable now', function () {
      var s = new SetObject(),
        m = new MapObject(),
        a = {};

      s.add(1).add(2);
      expect(s.has(1) && s.has(2) && s.size).to.be(2);

      m.set(1, 1).set(a, 2);
      expect(m.has(1) && m.has(a) && m.size).to.be(2);
    });

    it('Recognize any iterable as the constructor input', function () {
      var a = new SetObject(new SetObject([1, 2]));

      expect(a.has(1)).to.be.ok();
    });
  });
}());
