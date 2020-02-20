const MongoClient = require( 'mongodb' ).MongoClient;
const uri = require('./MongoDB').mongoURI;

var _db;
module.exports = {
  connectToServer: function( callback ) {
    MongoClient.connect( uri , { useUnifiedTopology: true } , function( err, client ) {
      _db = client.db("ticket_support_db");
      return callback( err );
    } );
  },
  getDb: function() {
    return _db;
  }
};