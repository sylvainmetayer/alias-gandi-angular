const request = require('request');

const endpoint = 'http://localhost:3000/api';

/**
 * These tests are highly coupled to the data.js sample to check returned data are valid.
 */
describe('Auth Spec', function () {

  let accessToken = null;

  beforeAll(function (done) {
    // Get a valid token
    request.post({
      url: `${endpoint}/auth`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "password": "test", "provider": "gandi" })
    }, function (_error, _response, body) {
      let bodyJson = JSON.parse(body);
      accessToken = bodyJson.access_token;
      done();
    });
  });

  it("Should return domains", function (done) {
    request.get({
      url: `${endpoint}/domains`,
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${accessToken}` }
    }, function (_error, response, body) {
      expect(JSON.parse(body).length).toEqual(10)
      expect(response.statusCode).toEqual(200);
      done();
    });
  });

  it('Should get mailboxes ID for a given domain', function (done) {
    request.get({
      url: `${endpoint}/mailboxes/johnny.name`,
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${accessToken}` }
    }, function (_error, response, body) {
      console.log(body);
      expect(JSON.parse(body).length).toEqual(3)
      expect(response.statusCode).toEqual(200);
      done();
    });
  });

  it('Should get one mailbox of a given domain', function (done) {
    request.get({
      url: `${endpoint}/mailbox/johnny.name/26f42662-0158-43fa-a9de-de05c9985c6b`,
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${accessToken}` }
    }, function (__error, response, body) {
      expect(JSON.parse(body).aliases.length).toEqual(4);
      expect(response.statusCode).toEqual(200);
      done();
    });
  });

  it('Should update aliases for one mailbox of a given domain', function (done) {
    request.post({
      url: `${endpoint}/aliases/johnny.name/26f42662-0158-43fa-a9de-de05c9985c6b`,
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${accessToken}` },
      body: JSON.stringify({
        aliases: ["5pgd5rvnias"],
        domain: "johnny.name",
        mailboxId: "26f42662-0158-43fa-a9de-de05c9985c6b"
      })
    }, function (error, response, body) {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
});
