var checker = require('license-checker');

function isAllowedPackage(allowedPackages, dependency) {
  return allowedPackages.some(function(pkg) {
    return pkg.name.toLowerCase().indexOf(dependency.name.toLowerCase().split('@')[0]) !== -1;
  });
}

module.exports = function checkLicenses(config) {
  var currentPackage = config.__currentPackage;
  var allowedLicenses = config.allowedLicenses || [];
  var allowedPackages = config.allowedPackages || [];
  var warnOnUnknown = config.warnOnUnknown || false;
  var configPath = config.configPath;
  var ignoreDevDependencies = config.ignoreDevDependencies || false;
  var strictMode = config.strictMode || false;

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

    console.error(type + ' - ' + dep.name + ' ' + dep.licenses + ': ' + dep.repository);
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
      if (strictMode) {
        // Do exact check (also matching *)
        license = license.toLowerCase();
        licenses = licenses.toLowerCase();

        // See if license contains "OR" and match either
        // If a package contains more than one license separated by OR
        // Then you get to choose which license you abide by
        // So simply matching one will suffice
        var ors = licenses.split(' or ').map(
          function(o) {
            return o.replace('(','').replace(')','');
          }
        );

        if (ors.length > 1) {
          return ors.some(function(r) {
            return r === license;
          });
        }

        return licenses === license ||
               licenses === license + "*";
      } else {
        // Perform default fuzzy check (e.g. BSD or BSD-3-CLAUSE)
        return licenses.toLowerCase().indexOf(license.toLowerCase()) !== -1;
      }
    });
  }

  function check() {
    checker.init({
      start: process.cwd(),
      production: ignoreDevDependencies
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
          var aLower = Array.isArray(a.licenses) ? a.licenses[0].toLowerCase() : a.licenses.toLowerCase();
          var bLower = Array.isArray(b.licenses) ? b.licenses[0].toLowerCase() : b.licenses.toLowerCase();
          return aLower < bLower ? -1 : aLower > bLower ? 1 : 0;
        });
        prohibitedDeps.map(function(dep) { log(dep); });

        console.log('');
        console.log('If you need to add an exception for the disallowed packages,');
        console.log('You will want to modify the config file: ' + configPath);
        console.log('by adding an new entry to the allowedPackages array.');
        console.log('');
        console.log('It takes in an object with a name key:');
        console.log('{');
        console.log('  "name": "allowed-package-name-here",');
        console.log('  "reason": "reason for allowing" // optional');
        console.log('}');
        console.log('For more info: check out the repo https://github.com/behance/license-to-fail');

        process.exit(1);
      }
    });
  }

  return {
    check: check,
    isAllowedDependency: isAllowedDependency
  }
};
