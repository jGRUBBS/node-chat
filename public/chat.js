window.onload = function() {
 
  var messages   = [],
      socket     = io.connect(),
      field      = document.getElementById("field"),
      sendButton = document.getElementById("send"),
      content    = document.getElementById("content"),
      name       = document.getElementById("name"),
      setName    = document.getElementById("set-name"),
      msgFields  = document.getElementById("message-fields"),
      nameField  = document.getElementById("name-field");

  socket.on('message', displayMessages);
  socket.on('enterance', displayMessages);

  setName.onclick = function() {
    if (name.value == '') {
      alert('Please enter a name before submitting.');
    } else {
      socket.emit('set username', { username: name.value }, function(data){
        if ( data == 'username taken' ) {
          alert('Username has already been taken. Try again.');
          name.value = '';
        } else {
          nameField.setAttribute("disabled");
          msgFields.removeAttribute("disabled");
        }
      });
    }
  };

  sendButton.onclick = function() {
    socket.emit('send', { message: field.value, username: name.value });
    field.value = '';
  };
 
  function displayMessages(data) {
    if (data.message) {
      messages.push(data);
      var html = '';
      for(var i = 0; i < messages.length; i++) {
        if (!messages[i].enterance) html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
        html += messages[i].message + '<br />';
      }
      content.innerHTML = html;
    } else {
      console.log("There is a problem:", data);
    }
  }

};