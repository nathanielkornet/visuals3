var Express = require('express')
var app = new Express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(Express.static(__dirname + '/dist'))

io.on('connection', function (socket) {
  console.log('a user connected')
  socket.on('test', function (data) {
    console.log(data)
    socket.broadcast.emit('test', data)
  })
})

http.listen(9001, function () {
  console.log('Server running on port 9001')
})
