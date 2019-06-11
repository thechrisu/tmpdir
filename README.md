# tmpdir
Utility for writing tests with temporary directories

# Possible syntax
## Wrap the function
```node
describe('MyTest', () => withTmpDir((tmpDirPath) => {
  myModule.thingThatHasSideEffects(
    predefinedInputDir,
    tmpDirPath
  );
  testOutputIsCorrect(tmpDirPath);
}));
```
## Separate function
```node
describe('MyTest', () => {
  tmpDirPath = getTmpDir();
  myModule.thingThatHasSideEffects(
    predefinedInputDir,
    tmpDirPath
  );
  testOutputIsCorrect(tmpDirPath);
});
```
... alternatively do this as a promise (oh man..)
## beforeEach-style
```node
describe('MySuite', () => {
  beforeEach(() => {
    // create tmp dir here, clean up afterward, somehow pass the information to the main test
  });
});
```
TODO(cuontheinternet): Chai spies
TODO(cuontheinternet): Decorator

require('tmpdir') // using os.tmpdir() as base temporary directory

