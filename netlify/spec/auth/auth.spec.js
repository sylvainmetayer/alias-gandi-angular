const request = require('request');

const endpoint = 'http://localhost:3000/api/auth';

describe('Auth Spec', function () {
  it('should not allow to authenticate via GET request', function (done) {
    request.get(endpoint, function (error, response) {
      expect(response.statusCode).toEqual(405);
      done();
    });
  });

  it("Should fail on empty POST request", function (done) {
    request.post(endpoint, {}, function (error, response, body) {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it("Should fail with bad password", function (done) {
    request.post({
      url: endpoint,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "password": "bad-test" })
    }, function (error, response, body) {
      expect(response.statusCode).toEqual(401);
      done();
    });
  });

  it("Should fail when missing provider but good password", function (done) {
    request.post({
      url: endpoint,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "password": "test" })
    }, function (error, response, body) {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it("Should fail when provider does not exists", function (done) {
    request.post({
      url: endpoint,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "password": "test", "provider": "toto" })
    }, function (error, response, body) {
      expect(body).toEqual("toto does not exists");
      expect(response.statusCode).toEqual(400);
      done();
    });
  });


  it("Should get a token valid 1h when valid password", function (done) {
    request.post({
      url: endpoint,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "password": "test", "provider": "gandi" })
    }, function (error, response, body) {
      body = JSON.parse(body);
      expect(body.expires_in).toEqual(3600);
      expect(body.token_type).toEqual("JWT");
      expect(body.access_token).toBeDefined();
      expect(response.statusCode).toEqual(200);
      done();
    });
  });

  // it('should fail on POST', function (done) {
  //     request.post(baseUrl, {json: true, body: {}}, function (error, response) {
  //         expect(response.statusCode).toEqual(404);
  //         done();
  //     });
  // });
});
