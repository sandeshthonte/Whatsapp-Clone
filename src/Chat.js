import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MicIcon from "@material-ui/icons/Mic";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import db from "./firebase";
import firebase from "firebase";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(null);
  const [heeey, setSeed] = useState("");
  let { roomId } = useParams(); //imp imp
  const [user, setUsers] = useState(JSON.parse(localStorage.getItem("user")));
  const photo = false;
  const [roomName, setRoomName] = useState("Select Room");
  const [room, setRoom] = useState({});

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) =>
          setRoom({
            id: snapshot.data().id,
            name: snapshot.data().name,
            photo: snapshot.data().photo,
          })
        );

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
    setUsers(JSON.parse(localStorage.getItem("user")));
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("rooms").doc(roomId).collection("messages").add({
      context: input,
      name: user.name,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    // setMessages("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        {room.photo ? (
          <img src={room.photo} alt={user.name} id="photo" />
        ) : (
          <Avatar src={`https://avatars.dicebear.com/api/human/${heeey}.svg`} />
        )}

        <div className="chat__headerInfo">
          <h3>{room.name}</h3>
          <p>
            {messages &&
              new Date(
                messages[messages.length - 1]?.timestamp?.toDate()
              ).toUTCString()}
          </p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages &&
          user &&
          messages.map((message) => (
            <p
              className={`chat__message ${
                message.name === user.name && "chat__receiver"
              }`}
              key={message.id}
            >
              {message.context}
              <span className="chat__name">{message.name}</span>
              <span className="chat__timestamp">
                {message.timestamp &&
                  new Date(message.timestamp.toDate()).toUTCString()}
              </span>
            </p>
          ))}
      </div>

      <div className="chat__footer">
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
