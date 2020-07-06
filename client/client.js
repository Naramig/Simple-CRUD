const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');

const authUrl = 'grpc-server:8080';
const app = express();
app.use(bodyParser.json());

//gRPC settings
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
var gRPCClient = new proto.CRUDfunctions(authUrl, grpc.credentials.createInsecure());

app.get('/', (req, res) => {
    gRPCClient.getAll( {},function(err, response) {
      if(err)
        res.status(400).send(err.details);
      else{
        console.log(response);
        res.status(200).send(response);
      }
    });
})

app.post('/', (req, res) => {
    var testStringT = req.body.testString;
    gRPCClient.insert({testString: testStringT}, function(err, response) {
        if(err)
            res.status(400).send(err.details);
        else
            res.status(200).send(response);
    });
})

app.get('/:id', (req, res) => {
    const idT = req.params.id;
    gRPCClient.get({id: idT}, function(err, response) {
        if(err)
            res.status(400).send(err.details);
        else
            res.status(200).send(response);
    });
})

app.put('/:id', (req, res) => {
    const idT = req.params.id;
    const testStringT = req.body.testString
    gRPCClient.update({id: idT, testString: testStringT}, function(err, response){
        if(err)
            res.status(400).send(err.details);
        else
            res.status(200).send(response);
    });
})

app.delete('/:id', (req, res) => {
    const idT = req.params.id;
    gRPCClient.remove({id: idT}, function(err, response) {
        if(err)
            res.status(400).send(err);
        else
            res.status(200).send(response);
    });
})

app.listen('8081', function () {
    console.log('Client is running.. on Port '+  ' 8081');
});
