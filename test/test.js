const assert = require('assert');
const fs = require('fs');
const tempDir = require('../lib.js');

describe('TempDir works', () => {
  it('creates the temp directory', () => {
    tempDir.provide().then(tmpDir => {
      assert.ok(fs.lstatSync(tmpDir).isDirectory());
    });
  });
  it('changes the temp dir on subsequent calls', () => {
    tempDir.provide().then(tmpDir1 => {
      tempDir.provide().then(tmpDir2 => {
        assert.notDeepStrictEqual(tmpDir1, tmpDir2);
      });
    });
  });
  it('deletes very old test runs', () => {
    // TODO delete old dirs
    for (let i = 0; i < 5; i += 1) {
      const tempDirInstance = tempDir.build();
      tempDirInstance.provide().then();
    }
    const tempDirContents = fs.readdirSync(tempDir.getBaseDir());
    const tempDirCount = tempDirContents.filter(tempDir.isBaseDir).length;
    assert.ok(tempDirCount <= 3);
  });
  it('on re-import, same dir is used', () => {
    /* eslint-disable global-require */
    const reimport = require('../lib.js');
    assert.deepStrictEqual(tempDir.instanceDir, reimport.instanceDir);
  });
});
