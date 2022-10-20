const assert = require('assert');
const ldap = require('ldapjs');
const config = require('config');

// read config
const scheme = config.get('connection.scheme');
const host = config.get('connection.host');
var port = config.get('connection.port');

if (scheme != "ldap" && scheme != "ldaps") {
  throw new SyntaxError("Scheme can only be either ldap or ldaps.");
}

// using default port
if (port == "default") {
  if (scheme == "ldap") {
    port = 389;
  } else if (scheme == "ldaps") {
    port = 636;
  }
}

const username = config.get('user.name');
const userpassword = config.get('user.password');

const url = scheme + '://' + host + ':' + port;

const client = ldap.createClient({url: url});

// print details
console.log('Connect to ' + url);
console.log('user name: '+ username);

// bind
client.bind(username, userpassword, (err) => {
  assert.ifError(err);
  console.log('Bind succeed!');

  // unbind after binding
  client.unbind((err) => {
    assert.ifError(err);
    console.log('Unbind succeed!');
  });
});
