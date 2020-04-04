const request = require('request');

const endpoint = 'http://localhost:3000/api';

describe('Auth Spec', function () {

  accessToken = null;

  beforeAll(function (done) {
    // Get a valid token
    request.post({
      url: `${endpoint}/auth`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "password": "test", "provider": "gandi" })
    }, function (error, response, body) {
      body = JSON.parse(body);
      accessToken = body.access_token;
      done();
    });
  });

  it("Should return domains", function (done) {
    request.get({
      url: `${endpoint}/domains`,
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${accessToken}` }
    }, function (error, response, body) {
      body = JSON.parse(body);
      expect(response.statusCode).toEqual(200);
      done();
    });
  });

  it('Should get mailboxes ID for a given domain', function (done) {
    request.get({
      url: `${endpoint}/mailboxes/sylvainmetayer.fr`,
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${accessToken}` }
    }, function (error, response, body) {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });

  it('Should get aliases for one mailbox of a given domain', function (done) {
    request.get({
      url: `${endpoint}/mailboxes/sylvainmetayer.fr`,
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${accessToken}` }
    }, function (error, response, body) {
      body = JSON.parse(body);
      mailboxId = body[0];
      request.get({
        url: `${endpoint}/mailbox/sylvainmetayer.fr/${mailboxId}`,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${accessToken}` }
      }, function (error, response, body) {
        expect(response.statusCode).toEqual(200);
        done();
      });
    });
  });


  it('Should update aliases for one mailbox of a given domain', function (done) {
    // TODO Find a way to mock this without using a no-reply testing email.
    request.post({
      url: `${endpoint}/aliases/sylvainmetayer.fr/e4df1649-9631-48af-b3fb-0a4a0fa0a5e5`,
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${accessToken}` },
      body: JSON.stringify({
        aliases: ["5pgd5rvnias"],
        domain: "sylvainmetayer.fr",
        mailboxId: "e4df1649-9631-48af-b3fb-0a4a0fa0a5e5"
      })
    }, function (error, response, body) {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
});
