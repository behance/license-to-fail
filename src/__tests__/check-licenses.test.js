const test = require('ava');

test('should fail on BSD-3-Clause if in strict mode and only BSD is whitelisted', (t) => {
  const checkLicenses = require('../check-licenses');
  const config = {
    'allowedLicenses': [
      'BSD'
    ],
    'strictMode': true
  };
  const sampleDependency = {
    name: 'foo@1.0.0',
    licenses: 'BSD-3-Clause',
    repository: 'https://github.com/foo',
    licenseFile: '/path/to/LICENSE'
  };

  t.is(checkLicenses(config).isAllowedDependency(sampleDependency), false);
});

test('should pass if license is BSD or MIT if only BSD is whitelisted in strictMode', (t) => {
  const checkLicenses = require('../check-licenses');
  const config = {
    'allowedLicenses': [
      'BSD'
    ],
    'strictMode': true
  };
  const sampleDependency = {
    name: 'foo@1.0.0',
    licenses: 'BSD OR MIT',
    repository: 'https://github.com/foo',
    licenseFile: '/path/to/LICENSE'
  };
  const sampleDependencyWithParens = {
    name: 'foo@1.0.0',
    licenses: '(BSD OR MIT)',
    repository: 'https://github.com/foo',
    licenseFile: '/path/to/LICENSE'
  };

  t.is(checkLicenses(config).isAllowedDependency(sampleDependency), true);
  t.is(checkLicenses(config).isAllowedDependency(sampleDependencyWithParens), true);
});

test('should pass if package name contains upper case characters', (t) => {
  const checkLicenses = require('../check-licenses');
  const config = {
    'allowedPackages': [
      {
        "name": "Foo@1.0.0",
        "reason": "ISC"
      }
    ],
    'allowedLicenses': []
  };
  const sampleDependency = {
    name: 'Foo@1.0.0',
    repository: 'https://github.com/foo',
    licenseFile: '/path/to/LICENSE'
  };

  t.is(checkLicenses(config).isAllowedDependency(sampleDependency), true);
});
