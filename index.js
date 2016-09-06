var checker = require('license-checker');

function isAllowedPackage(allowedPackages, dependency) {
  return allowedPackages.some(function(pkg) {
    return pkg.name.indexOf(dependency.name.toLowerCase().split('@')[0]) !== -1;
  });
}

module.exports = function checkLicenses(config) {
  var currentPackage = config.__currentPackage;
  var allowedLicenses = config.allowedLicenses;
  var allowedPackages = config.allowedPackages;
  var warnOnUnknown = config.warnOnUnknown;

  function log(dep) {
    var type = 'INDIRECT DEP';
    if (currentPackage.dependencies[dep.name]) {
      type = 'DEP';
    }
    else if (currentPackage.devDependencies[dep.name]) {
      type = 'DEVDEP';
    }
    else if (currentPackage.peerDependencies[dep.name]) {
      type = 'PEERDEP';
    }
    else if (currentPackage.optionalDependencies[dep.name]) {
      type = 'OPTIONALDEP';
    }

    console.log(type + ' - ' + dep.name + ' ' + dep.licenses + ': ' + dep.repository);
  }

  function isAllowedDependency(dependency) {
    var licenses = dependency.licenses;

    if (Array.isArray(licenses)) {
      return licenses.some(function(license) {
        return isAllowedDependency({ name: dependency.name, licenses: license });
      });
    }

    return isAllowedPackage(allowedPackages, dependency) ||
    allowedLicenses.some(function(license) {
      return licenses.toLowerCase().indexOf(license.toLowerCase()) !== -1;
    });
  }

  checker.init({
    start: process.cwd()
  }, function(err, json) {
    var prohibitedDeps = Object.keys(json)
      .map(function(dep) {
        return {
          name: dep,
          licenses: json[dep].licenses,
          repository: json[dep].repository,
          licenseFile: json[dep].licenseFile
        };
      })
      .filter(function(dep) {
        if (isAllowedDependency(dep)) return false;
        // don't check the current package
        if (dep.name.indexOf(currentPackage.name) !== -1) return false;
        // weird unknown package?
        if (dep.name === 'undefined@undefined') return false;

        if (warnOnUnknown && dep.licenses === 'UNKNOWN') {
          log(dep);
          return false;
        };

        return true;
      });

    if (prohibitedDeps.length) {
      console.log('');
      console.log('Disallowed Licenses:');
      prohibitedDeps.sort(function(a, b) {
        var aLower = a.licenses.toLowerCase();
        var bLower = b.licenses.toLowerCase();
        return aLower < bLower ? -1 : aLower > bLower ? 1 : 0;
      });
      prohibitedDeps.map(function(dep) { log(dep); });
      process.exit(1);
    }
  });
};
