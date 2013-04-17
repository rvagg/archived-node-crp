const os     = require('os')
    , fs     = require('fs')
    , path   = require('path')
    , test   = require('tap').test
    , canvas = require('canvas')
    , sz     = require('sz')
    , crp    = require('./')

// NOTE: these are basically resize tests, I don't have a good way
// at the moment to test an actual crop and not just a resize has occurred
// but if you're reading this and can think of an easy way then please
// go ahead and suggest it!

function cropTest (name, src, width, height) {
  test(name, function (t) {
    t.plan(4)
    crp(src, width, height, function (err, dst) {
      t.notOk(err, 'no error')
      t.ok(Buffer.isBuffer(dst), 'response is a Buffer')
      sz(dst, function (err, size) {
        t.notOk(err, 'no error')
        t.deepEqual(size, { width: width, height: height }, 'cropped image is correct size')
      })
    })
  })
}

cropTest(
    'test crop jpg file'
  , path.join(__dirname, 'node_modules/sz/test-data/avatar.jpg')
  , 10, 20
)

cropTest(
    'test crop jpg buffer'
  , fs.readFileSync(path.join(__dirname, 'node_modules/sz/test-data/avatar.jpg'))
  , 100, 200
)

cropTest(
    'test crop gif file'
  , path.join(__dirname, 'node_modules/sz/test-data/python_logo.gif')
  , 1000, 2000
)

cropTest(
    'test crop gif buffer'
  , fs.readFileSync(path.join(__dirname, 'node_modules/sz/test-data/python_logo.gif'))
  , 1, 2
)

cropTest(
    'test crop png file'
  , path.join(__dirname, 'node_modules/sz/test-data/node_logo.png')
  , 200, 20
)

cropTest(
    'test crop png buffer'
  , fs.readFileSync(path.join(__dirname, 'node_modules/sz/test-data/node_logo.png'))
  , 100, 100
)

cropTest(
    'test crop animated gif file'
  , path.join(__dirname, 'node_modules/sz/test-data/nyan.gif')
  , 10, 10
)

cropTest(
    'test crop animated gif buffer'
  , fs.readFileSync(path.join(__dirname, 'node_modules/sz/test-data/nyan.gif'))
  , 500, 5
)

test('test no such file', function (t) {
  t.plan(2)
  crp('foobar.gif', 10, 10, function (err, size) {
    t.ok((/error/i).test(err), 'got error message')
    t.ok(size === undefined, 'no size provided')
  })
})

test('test writing straight to file', function (t) {
  var src = path.join(__dirname, 'node_modules/sz/test-data/avatar.jpg')
    , dst = path.join(os.tmpDir(), String(Math.random()) + 'avatar.png')

  t.plan(3)
  crp(src, 100, 200, dst, function (err) {
    t.notOk(err, 'no error')
    sz(dst, function (err, size) {
      t.notOk(err, 'no error')
      t.deepEqual(size, { width: 100, height: 200 }, 'cropped image is correct size')
      fs.unlinkSync(dst)
    })
  })
})

test('test height and width in options object', function (t) {
  var src = path.join(__dirname, 'node_modules/sz/test-data/avatar.jpg')

  t.plan(3)
  crp(src, { width: 100, height: 200 }, function (err, dst) {
    t.notOk(err, 'no error')
    sz(dst, function (err, size) {
      t.notOk(err, 'no error')
      t.deepEqual(size, { width: 100, height: 200 }, 'cropped image is correct size')
    })
  })
})

test('test height and width in options object and write to file', function (t) {
  var src = path.join(__dirname, 'node_modules/sz/test-data/avatar.jpg')
    , dst = path.join(os.tmpDir(), String(Math.random()) + 'avatar.png')

  t.plan(3)
  crp(src, { width: 100, height: 200 }, dst, function (err) {
    t.notOk(err, 'no error')
    sz(dst, function (err, size) {
      t.notOk(err, 'no error')
      t.deepEqual(size, { width: 100, height: 200 }, 'cropped image is correct size')
      fs.unlinkSync(dst)
    })
  })
})