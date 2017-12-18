'use strict';

var co = require('co');
var SLS = require('./lib/sls');
var QueryIp = require('./lib/ip');
var _ = require('lodash');

module.exports.handler = function (event, context, callback) {

  var config = JSON.parse(event.toString());
  var queries = config.queryParameters;

  // console.setLogLevel(config.logLevel || 'error');

  co(function* () {

    var sls = new SLS(context.credentials, {
      project: queries.project,
      logStore: queries.logStore,
      endpoint: queries.endpoint,
    });
    var queryIp = new QueryIp(queries.appCode);

    var logs = yield sls.getLogs(queries.from, queries.to);

    var processedLogs = yield logs.map(function(log) {
      return queryIp.query(log.ip)
        .then(function(ret) {
          return _.assign({
            location: ret,
          }, log);
        });
    });

    return processedLogs;

  }).then(function (logs) {
    callback(null, {
      "isBase64Encoded": false,
      "statusCode": 200,
      "headers": {},
      "body": logs,
    });
  }).catch(callback);
}