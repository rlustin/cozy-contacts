// Generated by CoffeeScript 1.9.3
var fs, im, resize;

fs = require('fs');

im = require('imagemagick');

resize = function(raw, file, name, callback) {
  var options;
  options = {
    mode: 'crop',
    width: 300,
    height: 300
  };
  options.srcPath = raw;
  options.dstPath = "/tmp/2-" + file.name;
  fs.openSync(options.dstPath, 'w');
  return im[options.mode](options, (function(_this) {
    return function(err, stdout, stderr) {
      if (err) {
        return callback(err);
      }
      return file.attachBinary(options.dstPath, {
        name: name
      }, function(err) {
        return fs.unlink(options.dstPath, function() {
          return callback(err);
        });
      });
    };
  })(this));
};

module.exports.create = function(file, callback) {
  var rawFile, ref;
  if (file.binary == null) {
    return callback(new Error('no binary'));
  }
  if (((ref = file.binary) != null ? ref.thumb : void 0) != null) {
    console.log("createThumb " + file.id + " : already done");
    return callback();
  } else {
    rawFile = "/tmp/" + file.name;
    return fs.open(rawFile, 'w', function(err) {
      var stream;
      stream = file.getBinary('file', function(err) {
        if (err) {
          return callback(err);
        }
      });
      stream.pipe(fs.createWriteStream(rawFile));
      stream.on('error', callback);
      return stream.on('end', (function(_this) {
        return function() {
          return resize(rawFile, file, 'thumb', function(err) {
            return fs.unlink(rawFile, function() {
              console.log("createThumb " + file.id + " : done");
              return callback(err);
            });
          });
        };
      })(this));
    });
  }
};
