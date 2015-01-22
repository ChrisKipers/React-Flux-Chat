var guid = require('guid');
var Q = require('q');

function getNewId() {
  return guid.raw();
}

function getPromiseFromValue(value) {
  var deferred = Q.defer();
  deferred.resolve(value);
  return deferred.promise;
}

module.exports = {
  getNewId: getNewId,
  getPromiseFromValue: getPromiseFromValue
};