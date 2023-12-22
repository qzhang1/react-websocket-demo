import "./App.css";
import { socket } from "./socket";
import { useState } from "react";

export default function Chat({
  currentUser,
  users,
  selectedUser,
  setSelectedUser,
  currentChat,
  setCurrentChat,
}) {
  const [newMsg, setNewMsg] = useState("");
  const handleOnSelectUser = (user) => {
    if (user.userID !== currentUser.userID) {
      setSelectedUser(user);
      setCurrentChat(user.messages);
    }
  };
  const handleNewMsgKeyDown = (e) => {
    if (e.keyCode === 13) {
      console.log("socket emit new message");
      const message = {
        from: currentUser.userID,
        to: selectedUser.userID,
        content: newMsg,
      };
      socket.emit("private message", message);
      selectedUser.messages.push(message);
      setSelectedUser(selectedUser);
      setNewMsg("");
    }
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <h3>Users</h3>
        <ul>
          {users.map((u) => (
            <li
              className={
                "user " +
                (selectedUser && selectedUser.userID === u.userID
                  ? "selected"
                  : "")
              }
              onClick={() => handleOnSelectUser(u)}
            >
              <span className="name">{u.username}</span>
              {u.connected ? (
                <span className="status logged-in">●</span>
              ) : (
                <span className="status logged-off">●</span>
              )}
              {u.userID === currentUser.userID && <span>&nbsp;(You)</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-window">
        <ul className="chat-messages">
          <li className="message received">
            <div className="wrapper">
              <span>Hi Qi</span>
            </div>
          </li>
          <li className="message sent">
            <div className="wrapper">
              <span>Hey honey bunny</span>
            </div>
          </li>
          <li className="message sent">
            <div className="wrapper">
              <span>Who is the aram god?</span>
            </div>
          </li>
          {currentChat.length > 0 &&
            currentChat.map((m) => (
              <li
                className={
                  "message " +
                  (m.from === currentUser.userID ? "sent" : "received")
                }
              >
                <div className="wrapper">
                  <span>{m.content}</span>
                </div>
              </li>
            ))}
        </ul>
        <input
          className="chat-input"
          type="text"
          placeholder="begin your chat"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={handleNewMsgKeyDown}
        />
      </div>
    </div>
  );
}
