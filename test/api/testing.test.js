const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../server');
var mongodb = require('mongo-mock');

mongodb.max_delay = 0;
var MongoClient = mongodb.MongoClient;
MongoClient.persist="mongo.js";//persist the data to disk
 
// Connection URL
var url = 'mongodb://localhost:27017/';
// Checking if Database will conenct
describe('Database connection', () => {
  it('Connection established', () => {
    MongoClient.connect(url, {}, function(err, client) {
      // If we're here it means we're connected
      var db = client.db();
  })});
});
// Basic CRUD Operations
describe('Database CRUD Operations', () => {
  it('Create', () => {
    MongoClient.connect(url, {}, function(err, client) {
    var db = client.db();
    // Get the documents collection    
    var collection = db.collection('documents');
    // Insert some documents
    var docs = [ {a : 1}, {a : 2}, {a : 3}];
    collection.insertMany(docs, function(err, result) {
      // console.log('inserted',result);
      });
    })
  });

  it('Read', () => {
    MongoClient.connect(url, {}, function(err, client) {
    var db = client.db();
    // Reading the whole documents array, because if it wouldn't work then the collection wouldn't even be created at first place
    var collection = db.collection('documents');
    collection.find({}, {_id:-1}).toArray(function(err, docs) {
      // console.log('found',docs);
      });
    })
  });

  it('Update', () => {
    MongoClient.connect(url, {}, function(err, client) {
    var db = client.db();
    // Upadting the variable A with B
    var collection = db.collection('documents');
    collection.updateOne({ a : 2 }, { $set: { b : 1 } }, function(err, result) {
      // console.log('updated',result);
      });
    })
  });

  it('Delete', () => {
    MongoClient.connect(url, {}, function(err, client) {
    var db = client.db();
    // Deleting one of the documents inserted above
    var collection = db.collection('documents');
    collection.removeOne({ a : 3 }, function(err, result) {
      //console.log('removed',result);
      });
    })
  });

});
// Clean up and close any connections
describe('Close and Clean the database', () => {
  it('DB Cleared', () => {
    MongoClient.connect(url, {}, function(err, client) {
      var db = client.db();
      // Removing the full collection
      db.collection('documents').remove();
      })
  });
  it('Connection closed', () => {
    MongoClient.connect(url, {}, function(err, client) {
      var db = client.db();
      // Closing the current connection and as well other connections as they are all associated with the same application
      db.close();
      })
  })
  
});
// Test the back-end API, ADMIN/CLIENT
describe('BACK-END API TESTING', function() {

  // describe('Admin API', () => {
  //   it('Registration', (done) => {
  //     request(app)
  //         .post('/api/admin/Register')
  //         .set('Accept', 'application/json')
  //         .set('Content-Type', 'application/json')
  //         .send({ name: 'backend_admin2', username: 'bckend_admin2', password: 'admin1' })
  //         .expect(200)
  //         .expect('Content-Type', /json/)
  //         .expect(function(response) {
  //            expect(response.body).not.to.be.empty;
  //            expect(response.body).to.be.an('object')
  //            expect(response.body).to.have.deep.property('username', 'Username is free');
  //         })
  //         .end(done);
  //   });

  //   it('Registration with same details(pass means fail)', (done) => {
  //     request(app)
  //         .post('/api/admin/Register')
  //         .set('Accept', 'application/json')
  //         .set('Content-Type', 'application/json')
  //         .send({ name: 'backend_admin2', username: 'bckend_admin2', password: 'admin1' })
  //         .expect(200)
  //         .expect('Content-Type', /json/)
  //         .expect(function(response) {
  //            expect(response.body).not.to.be.empty;
  //            expect(response.body).to.be.an('object')
  //            expect(response.body).to.have.deep.property('username', 'Username_taken');
  //         })
  //         .end(done);
  //   });

  //   it('Authentication', (done) => {
  //     request(app)
  //       .post('/api/login/Login')
  //       .set('Accept', 'application/json')
  //       .set('Content-Type', 'application/json')
  //       .send({ username: 'bckend_admin1', password: 'admin1' })
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .expect(function(response) {
  //         expect(response.body).not.to.be.empty;
  //         expect(response.body).to.be.an('object')
  //         expect(response.body).to.have.deep.property('status', 'Authed_admin')
  //       })
  //       .end(done);
  //   });

  //   it('Authentication using invalid data', (done) => {
  //     request(app)
  //       .post('/api/login/Login')
  //       .set('Accept', 'application/json')
  //       .set('Content-Type', 'application/json')
  //       .send({ title: 'test_ticket', createdBy: 'bckend_admin', description: 'Test ticket created by testing suite', ticketState: '5', currentStaff: 'admin' })
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .expect(function(response) {
  //         expect(response.body).not.to.be.empty;
  //         expect(response.body).to.be.an('object')
  //         expect(response.body).to.have.deep.property('status', 'Not_Authed')
  //       })
  //       .end(done);
  //   });

  // });

  // describe('Client API', () => {
  //   it('Registration', (done) => {
  //     request(app)
  //         .post('/api/client/Register')
  //         .set('Accept', 'application/json')
  //         .set('Content-Type', 'application/json')
  //         .send({ name: 'client1', username: 'client1', password: 'client1' })
  //         .expect(200)
  //         .expect('Content-Type', /json/)
  //         .expect(function(response) {
  //            expect(response.body).not.to.be.empty;
  //            expect(response.body).to.be.an('object')
  //            expect(response.body).to.have.deep.property('username', 'Username is free');
  //         })
  //         .end(done);
  //   });

  //   it('Registration with same details(pass means fail)', (done) => {
  //     request(app)
  //         .post('/api/client/Register')
  //         .set('Accept', 'application/json')
  //         .set('Content-Type', 'application/json')
  //         .send({ name: 'client1', username: 'client1', password: 'client1' })
  //         .expect(200)
  //         .expect('Content-Type', /json/)
  //         .expect(function(response) {
  //            expect(response.body).not.to.be.empty;
  //            expect(response.body).to.be.an('object')
  //            expect(response.body).to.have.deep.property('username', 'Username_taken');
  //         })
  //         .end(done);
  //   });

  //   it('Authentication', (done) => {
  //     request(app)
  //       .post('/api/login/Login')
  //       .set('Accept', 'application/json')
  //       .set('Content-Type', 'application/json')
  //       .send({ username: 'client1', password: 'client1' })
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .expect(function(response) {
  //         expect(response.body).not.to.be.empty;
  //         expect(response.body).to.be.an('object')
  //         expect(response.body).to.have.deep.property('status', 'Authed_client')
  //       })
  //       .end(done);
  //   });

  //   it('Creation of a ticket', (done) => {
  //     request(app)
  //       .post('/api/client/CreateTicket')
  //       .set('Accept', 'application/json')
  //       .set('Content-Type', 'application/json')
  //       .send({ title: 'test_ticket', createdBy: 'client_Test', description: 'Test ticket created by testing suite', ticketState: '5', currentStaff: 'admin' })
  //       // 500 because we aint' using cookies to create this request, so 500 is what API will say although ticket will still be created.
  //       // The only issue will be with ticket history but for testing we don't need to worry about that because if this works then other functions will do too
  //       .expect(500)        
  //       .end(done);
  //   });

  // });
});