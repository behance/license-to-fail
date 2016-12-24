import test from 'ava';

test('should fail on BSD-3-Clause if in strict mode and only BSD is whitelisted', (t) => {
  var checkLicenses = require('../check-licenses');
  var config = {
    'allowedLicenses': [
      'BSD'
    ],
    'strictMode': true
  };
  var sampleDependency = {
    name: 'foo@1.0.0',
    licenses: 'BSD-3-Clause',
    repository: 'https://github.com/foo',
    licenseFile: '/path/to/LICENSE'
  };

  t.is(checkLicenses(config).isAllowedDependency(sampleDependency), false);
});

test('should pass if license is BSD or MIT if only BSD is whitelisted in strictMode', (t) => {
  var checkLicenses = require('../check-licenses');
  var config = {
    'allowedLicenses': [
      'BSD'
    ],
    'strictMode': true
  };
  var sampleDependency = {
    name: 'foo@1.0.0',
    licenses: 'BSD OR MIT',
    repository: 'https://github.com/foo',
    licenseFile: '/path/to/LICENSE'
  };
  var sampleDependencyWithParens = {
    name: 'foo@1.0.0',
    licenses: '(BSD OR MIT)',
    repository: 'https://github.com/foo',
    licenseFile: '/path/to/LICENSE'
  };

  t.is(checkLicenses(config).isAllowedDependency(sampleDependency), true);
  t.is(checkLicenses(config).isAllowedDependency(sampleDependencyWithParens), true);
});
