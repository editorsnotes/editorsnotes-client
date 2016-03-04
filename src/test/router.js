"use strict"

var test = require('tape')
  , sinon = require('sinon')


var Router = require('../router')


test('Router', function (t) {
  var spy = sinon.spy()
    , router

  t.plan(3);

  router = new Router([{
    '/': {
      name: 'the-route',
      foo: 'bar'
    }
  }], spy);

  router.execute('/');

  t.ok(spy.calledOnce);
  t.equal(spy.args[0][0], '/');
  t.equal(spy.args[0][1].foo, 'bar');
});


test('Router with parameters', function (t) {
  var spy = sinon.spy()
    , router

  t.plan(5);

  router = new Router([{
    '/:word': {
      name: 'the-route'
    }
  }], spy);

  router.execute('/blahblah?key=val&blah=boo');

  t.ok(spy.calledOnce);
  t.equal(spy.args[0][0], '/blahblah?key=val&blah=boo');
  t.equal(spy.args[0][2].word, 'blahblah');
  t.equal(spy.args[0][3].key, 'val');
  t.equal(spy.args[0][3].blah, 'boo');
});


test('Reversing router paths', function (t) {
  var router

  t.plan(7);

  router = new Router([{
    '/': { name: 'root' },
    '/things': { name: 'things' },
    '/things/:thingName/': { name: 'specific-thing' }
  }], () => null);

  t.equal(router.reverse('root'), '/');
  t.equal(router.reverse('things'), '/things');
  t.equal(router.reverse('specific-thing', 'a'), '/things/a/');
  t.equal(router.reverse('specific-thing', { thingName: 'a' }), '/things/a/');

  t.throws(
    () => router.reverse('nonsense'),
    /Router has no route named: nonsense/)

  t.throws(
    () => router.reverse('specific-thing', {}),
    /Route for specific-thing requires a parameter named: thingName/);

  t.throws(
    () => router.reverse('specific-thing'),
    /Route for specific-thing takes 1 parameters. Number passed: 0/);
});
