var assert = require('assert');
var ALY = require('aliyun-sdk');
var co = require('co');
var _ = require('lodash');

function SLS(credentials, config) {

  assert(config.endpoint, 'need endpoint');
  assert(config.project, 'need project name');
  assert(config.logStore, 'need log store name');

  this.config = config;
  this.inst = this.createInstance(credentials, config.endpoint);
}

SLS.prototype.createInstance = function (credentials, endpoint) {
  return new ALY.SLS({
    "accessKeyId": credentials.accessKeyId,
    "secretAccessKey": credentials.accessKeySecret,
    "securityToken": credentials.securityToken,
    endpoint: endpoint,
    apiVersion: '2015-06-01'
  });
}

SLS.prototype.getLogs = function (from, to) {
  var self = this;
  var config = self.config;
  return new Promise(function (resolve, reject) {
    self.inst.getLogs({
      //必选字段 
      projectName: config.project,
      logStoreName: config.logStore,
      from: from, //开始时间(精度为秒,从 1970-1-1 00:00:00 UTC 计算起的秒数)
      to: to,    //结束时间(精度为秒,从 1970-1-1 00:00:00 UTC 计算起的秒数)

      //以下为可选字段
      // topic: '',      //指定日志主题(用户所有主题可以通过listTopics获得)
      reverse: false,//是否反向读取,只能为 true 或者 false,不区分大小写(默认 false,为正向读取,即从 from 开始到 to 之间读取 Line 条)
      // query: '',    //查询的关键词,不输入关键词,则查询全部日志数据
      line: config.count || 100,   //读取的行数,默认值为 100,取值范围为 0-100
      offset: 0   //读取起始位置,默认值为 0,取值范围>0
    }, function (err, data) {

      if (err) {
        console.error('error:', err);
        reject(err);
      } else {
        console.info('success:', JSON.stringify(data));
        resolve(_.toArray(data.body));
      }

    });
  });
};

module.exports = SLS;