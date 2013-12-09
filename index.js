var express = require("express"),
    app     = express(),
    port    = 3700,
    names   = [];

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
  res.render("page");
});
app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
  socket.emit('message', { message: 'Welcome to the chat.' });
  socket.emit('message', { message: 'Please enter a name to begin.' });
  
  socket.on('set username', function (data, fn) {
    if ( names.indexOf(data.username) >= 0 ){
      fn('username taken');
    } else {
      names.push(data.username);
      socket.set('username', data.username);
      io.sockets.emit('enterance', { message: data.username + ' has entered.', enterance: true });
      fn();
    }
  });

  socket.on('send', function (data) {
    io.sockets.emit('message', data);
  });

  socket.on('disconnect', function(){
    var username = socket.store.data.username;
    if (typeof username == 'undefined') return false;
    names.splice(names.indexOf(username), 1);
    io.sockets.emit('enterance', { message: username + ' disconnected.', enterance: true });
  });
});