## license-to-fail [![npm](https://img.shields.io/npm/v/license-to-fail.svg)](https://www.npmjs.com/package/license-to-fail) [![travis](https://img.shields.io/travis/behance/license-to-fail/master.svg)](https://travis-ci.org/behance/license-to-fail)


Will error when any packages in `node_modules` don't satisfy your allowed licenses.

> Uses [`license-checker`](https://github.com/davglass/license-checker).

### Install

```
$ npm install license-to-fail --save-dev
```

### Usage

```bash
# use "license-to-fail" key in package.json
$ ./node_modules/.bin/license-to-fail.js
# pass a path to external config file
$ ./node_modules/.bin/license-to-fail.js ./path-to-config.js
```

> If there is no output, then there aren't any errors.

### Init

```bash
# creates a config.js file with the config in ./example-config.js
$ ./node_modules/.bin/license-to-fail.js init
```

### Config

It will ignore (not fail) on `UNKNOWN` licenses and just print them out to the console.

`allowedPackages`: takes an array of objects. The only required field is `name`.
`allowedLicenses`: takes an array of strings and calls `indexOf` on the licenses.

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
  ]
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

```
$ ./bin/license-to-fail.js ./config.js

Disallowed Licenses:
spdx-correct@1.0.2 Apache-2.0
validate-npm-package-license@3.0.1 Apache-2.0
package-license@0.1.2 Apache2
npm-license@0.3.3 BSD
normalize-package-data@2.3.5 BSD-2-Clause
license-checker@6.0.0 BSD-3-Clause
spdx-license-ids@1.2.2 Unlicense
jju@1.3.0 WTFPL

# Error with process.exit(1)
```

If we add more `allowedLicenses`:

```
$ npm run check-license # no failures
```
