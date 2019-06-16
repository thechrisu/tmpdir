# tmpdir
Utility for writing tests with temporary directories;

Ever in the situation that you need to work with real files in a test? If you're smart, you create those files in a temporary directory. This library manages the temporary directory for you by

1. Returning a promise that contains the created temporary directory
2. Cleaning up old temporary directories after a while, automatically.

# Usage
```node
tmpDir = require('tmpDir');

tmpDir.provide().then((tempDir) => {
  // this guarantees tempDir is a valid temporary directory
  // tempDir is placed in the system's temporary directory
});

// You can also configure the location where temporary directories should be created by calling
const noCleanup = true; // Optionally suspends deletion policy
const instance = tmpDir.build('/my/temp_path', noCleanup);

// instance is now a new tempDir instance that you can use separately
// whereas reimports of tempdir via require() will give you the same instance as a singleton
// Usually the singleton is plenty, using .build() should happen very infrequently.
```

## Deletion Strategy
Only the most three recent runs are being kept.