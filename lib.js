'use strict';

const fs = require('fs');
const os = require('os')
const path = require('path')
const shortid = require('shortid');

/**
 * TODO(cuontheinternet): Tests
 * TODO(cuontheinternet): Optional arg when requiring this
 * TODO(cuontheinternet): CI
 * TODO(cuontheinternet): Scope-limited factory thing
 * TODO(cuontheinternet): Check that func is not anonymous/stack trace in tests is nice
 * TODO(cuontheinternet): Delete behavior of pytest
 * TODO(cuontheinternet): Implement delete strategy
 * TODO(cuontheinternet): Docs
 * TODO(cuontheinternet): Manual
 * TODO(cuontheinternet): Publish
 */
class TempDir {
  constructor(baseDir) {
    if (baseDir == null || baseDir === false) {
      baseDir = os.tmpdir()
    }

    this.baseDir = baseDir;
  }

  make() {
    const now8601 = (new Date()).toISOString();
    const shortId = shortid.generate();
    const tmpDir = path.join(this.baseDir, now8601 + shortId);

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }
    return tmpDir;
  }
}
module.exports = TempDir;