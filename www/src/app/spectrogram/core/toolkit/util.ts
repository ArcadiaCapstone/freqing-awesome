/********************************************************
Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*********************************************************/
import {getAudioURL, getUploadsURL} from '../';

export const Util:any = {};

Util.loadTrackSrc = function(context, src, callback, opt_progressCallback) {

  const {
    ext,
    name
  } = Util.win32.parse(src);

  // src = getAudioURL(name, ext);
  src = getUploadsURL(name, ext);

  const request = new XMLHttpRequest();
  request.open('GET', src, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously.
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      callback(buffer);
    }, function(e) {
      console.error(e);
    });
  };
  if (opt_progressCallback) {
    request.onprogress = function(e) {
      const percent = e.loaded / e.total;
      opt_progressCallback(percent);
    };
  }

  request.send();
};

// Log scale conversion functions. Cheat sheet:
// http://stackoverflow.com/questions/19472747/convert-linear-scale-to-logarithmic
Util.setLogScale = function(x1, y1, x2, y2) {
  this.b = Math.log(y1/y2) / (x1-x2);
  this.a = y1 / Math.exp( this.b * x1 );
};

Util.lin2log = function(x) {
  return this.a * Math.exp( this.b * x );
};

Util.log2lin = function(y) {
  return Math.log( y / this.a ) / this.b;
};

// Regex to split a windows path into three parts: [*, device, slash,
// tail] windows-only
Util.splitDeviceRe =
  /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

// Regex to split the tail part of the above into [*, dir, basename, ext]
Util.splitTailRe =
  /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

Util.win32 = {};

// Function to split a filename into [root, dir, basename, ext]
function win32SplitPath(filename) {
  // Separate device+slash from tail
  const result = Util.splitDeviceRe.exec(filename),
    device = (result[1] || '') + (result[2] || ''),
    tail = result[3] || '';
  // Split the tail into dir, basename and extension
  const result2 = Util.splitTailRe.exec(tail),
    dir = result2[1],
    basename = result2[2],
    ext = result2[3];
  return [device, dir, basename, ext];
}

Util.win32.parse = function(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError(
      'Parameter \'pathString\' must be a string, not ' + typeof pathString
    );
  }
  const allParts = win32SplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError(`Invalid path '${pathString}'`);
  }
  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};

