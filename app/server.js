const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');


var server = new grpc.Server();

//gRPC Settings
var PROTO_PATH = __dirname + '/crud.proto';
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
  });
var proto = grpc.loadPackageDefinition(packageDefinition).crud;

//DB connection
const db = require("./models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
  const TestDB = db.testDBs;



async function GetAll(call, callback) {
  TestDB.find()
    .then(data => {
      callback(null, {tests: data});
    })
    .catch(err => {
      callback({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
}


async function Insert(call, callback) {
  const testDB = new TestDB({
    testString: call.request.testString
  });

  testDB
    .save(testDB)
    .then(data => {
      callback(null, data);
    })
    .catch(err => {
      callback(err, {});
    });
}

async function Get(call, callback) {
  const id = call.request.id;
  TestDB.findById(id)
      .then(data => {
        if (!data)
          throw new Error("Not Found");
        else 
          callback(null, data);
      })
      .catch(err => {
        callback(err, {});
      });
}

async function Update(call, callback) {
  const id = call.request.id;
  const testString = call.request.testString;

  TestDB.findByIdAndUpdate(id, {testString: testString}, { useFindAndModify: false })
      .then(data => {
        if (!data)
          throw new Error(`Cannot update TestDB with id=${id}. Maybe TestDB was not found!`);
        else
          callback(null, {msg: "Updated"});
      })
      .catch(err => {
        callback(err, {});
      });
}

async function Remove(call, callback){
  const id = call.request.id;

  TestDB.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          throw new Error(`Cannot delete TestDB with id=${id}`);
        } else {
          callback(null, {msg: "Deleted"});
        }
      })
      .catch(err => {
        callback(err, {});
      });
}


const PORT = process.env.PORT || 8080;

server.addService(proto.CRUDfunctions.service, {getAll: GetAll, insert: Insert, get: Get, update: Update, remove: Remove});
server.bind('0.0.0.0:' + PORT, grpc.ServerCredentials.createInsecure());
console.log("Server running at port " + PORT);
server.start();
