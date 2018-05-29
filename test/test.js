var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var mockData = require('./mockdata');
var should = chai.should();

chai.use(chaiHttp);

describe('Fetch details', function() {
	it('should have list users', function(done) {
		chai.request('localhost:8000')
			.get('/api/user/add')
			.send({
				firstName: mockData.firstName,
				lastName: mockData.lastName,
				email: mockData.email,
				password: mockData.password,
				contactNo: mockData.contactNo
			})
			.end(function(err, res) {
				expect(res).to.have.status(401);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('status');
				expect(res.body.status).to.equal('error');
				expect(res.body).to.have.property('message');
				expect(res.body.message).to.equal('User already registered with this email');
				done();
			});
	});
});