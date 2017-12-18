var SimpleClient = require('aliyun-api-gateway').SimpleClient;

function QueryIp(appCode) {
  this.client = new SimpleClient(appCode);
}

QueryIp.prototype.query = function (ip) {
  var url = 'http://iploc.market.alicloudapi.com/v3/ip';

  return this.client.get(url, {
    query: {
      ip: ip,
    },
    headers: {
      accept: 'application/json'
    }
  });
};

module.exports = QueryIp;