## license-to-fail [![npm](https://img.shields.io/npm/v/license-to-fail.svg)](https://www.npmjs.com/package/license-to-fail) [![travis](https://img.shields.io/travis/behance/license-to-fail/master.svg)](https://travis-ci.org/behance/license-to-fail) [![npm-downloads](https://img.shields.io/npm/dm/license-to-fail.svg)](https://www.npmjs.com/package/license-to-fail)

Will error when any packages in `node_modules` don't satisfy your allowed licenses.

> Uses [`license-checker`](https://github.com/davglass/license-checker).

### Install

```
$ npm install license-to-fail --save-dev
```

### Usage

```bash
# use "license-to-fail" key in package.json
$ ./node_modules/.bin/license-to-fail
# pass a path to external config file
$ ./node_modules/.bin/license-to-fail ./path-to-config.js
```

> If there is no output, then there aren't any errors.

### Init

```bash
# creates a config.js file with the config in ./example-config.js
$ ./node_modules/.bin/license-to-fail init
```

### Config

`allowedPackages`: takes an array of objects. The only required field is `name`.

`allowedLicenses`: takes an array of strings and calls `indexOf` on the licenses.

`warnOnUnknown`: instead of erroring on packages with an `UNKNOWN` license, just warn. (false by default)

`ignoreDevDependencies`: do not check licenses for devDependencies. (false by default)
```js
// ./config.js
module.exports = {
  allowedPackages: [
    {
      "name": "allowed-package-name-here",
      "extraFieldsForDocumentation": "hello!", // optional
      "date": "date added", // optional
      "reason": "reason for allowing" // optional
    }
  ],
  allowedLicenses: [
    "MIT",
    "Apache",
    "ISC",
    "WTF"
  ],
  warnOnUnknown: true
};
```

#### In package.json

```js
{
  "name": "package-name",
  "license-to-fail": {
    "allowedPackages": [
      {
        "name": "allowed-package-name-here",
      }
  ],
    allowedLicenses: [
      "MIT"
    ]
  }
}
```

### Example Usage/Output

> Running the tool on itself

If the config was `MIT, ISC` only:

```js
module.exports = {
  "allowedPackages": [],
  "disallowedPackages": [],
  "allowedLicenses": [
    "MIT",
    "ISC"
  ]
};
```

You would have this output:

It will try to print the package name, version, license, and repo.

It will also print whether it is a direct dependency of the current node_modules (looks at package.json) or not.

```
$ ./bin/license-to-fail ./config.js

Disallowed Licenses:
INDIRECT DEP - spdx-correct@1.0.2 Apache-2.0: https://github.com/kemitchell/spdx-correct.js
INDIRECT DEP - validate-npm-package-license@3.0.1 Apache-2.0: https://github.com/kemitchell/validate-npm-package-license.js
INDIRECT DEP - package-license@0.1.2 Apache2: https://github.com/AceMetrix/package-license
INDIRECT DEP - npm-license@0.3.3 BSD: https://github.com/AceMetrix/npm-license
INDIRECT DEP - normalize-package-data@2.3.5 BSD-2-Clause: https://github.com/npm/normalize-package-data
INDIRECT DEP - license-checker@6.0.0 BSD-3-Clause: https://github.com/davglass/license-checker
INDIRECT DEP - spdx-license-ids@1.2.2 Unlicense: https://github.com/shinnn/spdx-license-ids
INDIRECT DEP - jju@1.3.0 WTFPL: https://github.com/rlidwka/jju

# Error with process.exit(1)
```

If we add more `allowedLicenses`:

```
$ npm run check-license # no failures
```
