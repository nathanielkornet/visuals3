var express = require('express');
var server = new express();

server.use(express.static(__dirname + '/dist'))

server.listen(9001, function () {
  console.log('Server running on port 9001')
})
