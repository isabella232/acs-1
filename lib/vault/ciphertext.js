'use strict';

const rp = require('request-promise');

const TOKEND_ENDPOINT = `http://${Config.get('tokend:host')}:${Config.get('tokend:port')}${Config.get('tokend:path')}`;
const VAULT_ENDPOINT = `http${Config.get('vault:tls') ? 's' : ''}://${Config.get('vault:host')}:${Config.get('vault:port')}`;

const getToken = () => rp({uri: TOKEND_ENDPOINT, json: true}).then((body) => body.token);

module.exports = function generateCiphertext(key, secret) {
  return getToken().then((token) => {
    const options = {
      method: 'POST',
      uri: `${VAULT_ENDPOINT}/v1/transit/encrypt/${key}`,
      body: {
        plaintext: secret
      },
      headers: {
        'X-Vault-Token': token
      },
      json: true
    };

    return rp(options);
  }).then((resp) => resp.data.ciphertext);
};