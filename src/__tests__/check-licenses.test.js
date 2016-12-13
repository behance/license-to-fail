
test('should fail on BSD-3-Clause if in strict mode and only BSD is whitelisted', () => {
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

  expect(checkLicenses(config).isAllowedDependency(sampleDependency)).toBe(false);
});

test('should pass if license is BSD or MIT if only BSD is whitelisted in strictMode', () => {
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

  expect(checkLicenses(config).isAllowedDependency(sampleDependency)).toBe(true);
  expect(checkLicenses(config).isAllowedDependency(sampleDependencyWithParens)).toBe(true);
});
