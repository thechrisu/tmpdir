const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const process = require('process');
const shortid = require('shortid');
const Promise = require('bluebird');

const isoRegexStr = /tempDir_\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/g;

/* eslint-disable no-underscore-dangle */
let _singleton = null;

/**
 * TODO(cuontheinternet): Check that func is not anonymous/stack trace in tests is nice
 * TODO(cuontheinternet): Publish
 * Assumptions:
 * - TempDir might be called from several processes
 *  - TempDir might be imported multiple times
 * - We might want to persist some temp dir
 * Policies:
 * - Cleanup sometimes
 *  - Track
 * - All
 * 1. Create baseDir if it's not there
 *    - Issue:
 *    - sessionDir is supposed to be called each time we import TempDir
 *    - delete
 */
class TempDir {
  constructor(baseDir, noCleanup) {
    if (baseDir == null || baseDir === false) {
      if (fs.existsSync(os.tmpdir())) {
        this.baseDir = os.tmpdir();
      } else if (fs.existsSync('/tmp/')) {
        this.baseDir = '/tmp/';
      } else {
        this.baseDir = process.cwd();
      }
    } else {
      this.baseDir = baseDir;
    }
    this.noCleanup = noCleanup;

    const now8601 = (new Date()).toISOString();
    const dirName = `tempDir_${now8601}`;
    this.instanceDir = path.join(this.baseDir, dirName);

    if (!noCleanup) {
      this.deletePreviousRuns();
    }
  }

  deletePreviousRuns() {
    let allRunDirNames = fs.readdirSync(this.getBaseDir());
    const reg = new RegExp(isoRegexStr, 'g');
    allRunDirNames = allRunDirNames.filter(dirName => dirName.match(reg));
    const oldestRunNames = allRunDirNames.sort().reverse();
    const toDeleteNames = oldestRunNames.slice(2, allRunDirNames.length);
    const delPromises = toDeleteNames.map(
      /* eslint-disable comma-dangle */
      dirName => fs.remove(path.join(this.getBaseDir(), dirName))
    );
    Promise.all(delPromises);
  }

  getBaseDir() {
    return this.baseDir;
  }

  /* eslint-disable class-methods-use-this */
  isBaseDir(candidate) {
    return candidate.match(new RegExp(isoRegexStr, 'g'));
  }

  getSingleton() {
    if (!_singleton) {
      _singleton = this;
    }
    return _singleton;
  }

  // seems better than to execute functions by default.
  // also maybe an antipattern
  /* eslint-disable class-methods-use-this */
  build(baseDir = null, noCleanup = false) {
    return new TempDir(baseDir, noCleanup);
  }

  provide() {
    // TODO(cuontheinternet): Mode etc.
    // I heard the cool kids on the block use promises these days
    return new Promise((resolve, reject) => {
      try {
        const shortId = shortid.generate();
        const tmpDir = path.join(this.instanceDir, `${shortId}`);
        resolve(tmpDir);
      } catch (e) {
        reject(e);
      }
    }).then(tmpDir => fs.ensureDir(tmpDir).then(() => tmpDir));
  }
}

module.exports = new TempDir(os.tmpdir(), false).getSingleton();
