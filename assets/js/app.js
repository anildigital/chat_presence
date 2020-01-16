// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative paths, for example:

let roomId = window.roomId;

import socket from "./socket"

if (roomId) {
  let channel = socket.channel(`room:${roomId}`, {}); // connect to chat "room"

  channel.join()
    .receive("ok", resp => { console.log("Joined successfully", resp) })
    .receive("error", resp => { console.log("Unable to join", resp) })

  channel.on(`room:${roomId}:new_message`, function (payload) { // listen to the 'shout' event
    let li = document.createElement("li"); // create new list item DOM element
    let name = payload.name || 'guest';    // get name from payload or set default
    li.innerHTML = '<b>' + name + '</b>: ' + payload.message; // set li contents
    ul.appendChild(li);                    // append to list
  });

  let ul = document.getElementById('msg-list');  // list of messages.
  let name = document.getElementById('name');    // name of message sender
  let msg = document.getElementById('msg');      // message input field

  // "listen" for the [Enter] keypress event to send a message:
  msg.addEventListener('keypress', function (event) {
    if (event.keyCode == 13 && msg.value.length > 0) { // don't send empty msg.
      channel.push('message:add', { // send the message to the server on "shout" channel
        name: name.value,     // get value of "name" of person sending the message
        message: msg.value    // get message text (value) from msg input field.
      });
      msg.value = '';         // reset the message input field for next message.
    }
  });
}
