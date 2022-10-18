const assert = require('assert');
const ldap = require('ldapjs');
const config = require('config');

// read config
const scheme = config.get('connection.scheme');
const host = config.get('connection.host');
const port = config.get('connection.port');

const username = config.get('user.name');
const userpassword = config.get('user.password');

const searchBase = config.get('search.base');
const searchScope = config.get('search.scope');
const searchFilter = config.get('search.filter');

const url = scheme + '://' + host + ':' + port;

const client = ldap.createClient({url: url});

// print details
console.log('Connect to ' + url);
console.log('user name: '+ username);
console.log('search base: '+ searchBase);
console.log('search scope: ' + searchScope);
console.log('search filter: '+ searchFilter);

// bind
client.bind(username, userpassword, function(err) {
  assert.ifError(err);
  console.log('Bind succeed!');

  // search
  client.search(searchBase, {searchFilter, scope: searchScope}, (err, res) => {
    assert.ifError(err);

    res.on('searchRequest', (searchRequest) => {
      console.log('searchRequest: ', searchRequest.messageID);
    });
    res.on('searchEntry', (entry) => {
      console.log('entry: ' + JSON.stringify(entry.object));
    });
    res.on('searchReference', (referral) => {
      console.log('referral: ' + referral.uris.join());
    });
    res.on('error', (err) => {
      console.error('error: ' + err.message);
    });
    res.on('end', (result) => {
      console.log('status: ' + result.status);

      // unbind at the end of searching
      client.unbind((err) => {
        assert.ifError(err);
        console.log('Unbind succeed!');
      });
    });
  });
});
