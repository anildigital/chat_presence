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

import {Presence} from "phoenix"

let presences = {};
let userTyping = false;
var typingTimer
const timeout = 3000;

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

  const displayUsers = (presences) => {
    let usersOnline = Presence.list(presences, (_id, {
      metas: [
        user, ...rest
      ]
    }) => {
      var typingTemplate = ''
      if (user.typing) {
        typingTemplate = ' <i>(Typing...)</i>'
      }
      return `
        <div id="user-${user.user_id}">${user.username} ${typingTemplate}</div>
      `
    }).join("")

    document.querySelector('#users-online').innerHTML = usersOnline
  }

  channel.on("presence_state", state => {
    presences = Presence.syncState(presences, state)
    console.log(presences)
    displayUsers(presences)
  })

  channel.on("presence_diff", diff => {
    presences = Presence.syncDiff(presences, diff)
    console.log(presences)
    displayUsers(presences)
  })


  document.querySelector('#msg').addEventListener('keydown', () => {
    userStartsTyping()
    clearTimeout(typingTimer)
  })
  document.querySelector('#msg').addEventListener('keyup', () => {
    clearTimeout(typingTimer)
    typingTimer = setTimeout(userStopTyping, timeout)
  })

  const userStartsTyping = () => {
    if (userTyping) {
      return
    }

    userTyping = true
    channel.push('user:typing', {
      typing: true
    })
  }

  const userStopTyping = () => {
    clearTimeout(typingTimer)
    userTyping = false

    channel.push('user:typing', {
      typing: false
    })
  }


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
