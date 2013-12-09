const fs     = require('fs')
    , rsz    = require('rsz')
    , sz     = require('sz')

module.exports = function (src, width, height, dst, callback) {
  var options
    , originalSize

  function drawImage (ctx, image, width, height) {
    var x = (width - originalSize.width) / 2
      , y = (height - originalSize.height) / 2

    ctx.imageSmoothingEnabled = true
    ctx.drawImage(image, x, y, originalSize.width, originalSize.height)
  }

  if (typeof width == 'number') {
    options = {
        width  : width
      , height : height
    }
  } else {
    options  = width
    callback = dst
    dst      = height
  }

  options.drawImage = drawImage

  sz(src, function (err, size) {
    originalSize = size
    rsz(src, options, dst, callback)
  })
}