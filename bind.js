const assert = require('assert');
const ldap = require('ldapjs');
const config = require('config');

// read config
const scheme = config.get('connection.scheme');
const host = config.get('connection.host');
const port = config.get('connection.port');

const username = config.get('user.name');
const userpassword = config.get('user.password');

const url = scheme + '://' + host + ':' + port;

const client = ldap.createClient({url: url});

// bind
client.bind(username, userpassword, function(err) {
  assert.ifError(err);
  console.log('Bind succeed!');
});
