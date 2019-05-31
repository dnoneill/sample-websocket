var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// Send current time to all connected clients
function sendTime() {
    io.emit('time', { time: new Date().toJSON() });
}

// Send current time every 10 secs
setInterval(sendTime, 10000);

io.on('connection', function(socket) {
    console.log(`${socket.id} connected`)
    socket.emit('message', { message: 'Welcome!', id: socket.id });
    socket.on('broadcast', (message) => {
        socket.broadcast.emit('message', message);
    });
});

app.listen(process.env.PORT || 9030)
