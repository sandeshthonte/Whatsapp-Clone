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
import firebase from "firebase/app";
import emoji from "./json/emoji.json";
import Loaders from "./Loaders/Loaders.js";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";

function Chat() {
  let { roomId } = useParams(); //imp imp
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUsers] = useState(JSON.parse(localStorage.getItem("user")));
  const [room, setRoom] = useState({});
  const [pending, setpending] = useState(false);
  const [picker, setPicker] = useState(false);
  const [emojiInput, setEmojiInput] = useState(false);

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          if (snapshot.data()) {
            setRoom({
              id: snapshot.data().id,
              name: snapshot.data().name,
              photo: snapshot.data().photo,
              timestamp: snapshot.data().timestamp,
            });
          }
        });

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
    setUsers(JSON.parse(localStorage.getItem("user")));
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("rooms").doc(roomId).collection("messages").add({
      context: input,
      name: user.name,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      emotion: "",
    });
    setInput("");
  };

  const pickerHandler = () => {
    setPicker(!picker);
  };

  const onEmojiClick = (e, chosenEmoji) => {
    setInput((input) => input + chosenEmoji.emoji);
  };

  const getEmotion = async (message, e) => {
    // e.preventDefault();

    setpending(true);
    await db
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .where("context", "==", message.context)
      .where("name", "==", message.name)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          if (doc.id && roomId) {
            if (message.emotion) {
              await db
                .collection("rooms")
                .doc(roomId)
                .collection("messages")
                .doc(doc.id)
                .update({ emotion: "" })
                .then((data) => {
                  console.log("Erased Emotion");
                  setpending(false);
                })
                .catch((err) => {
                  console.log("Unable to Erase Emotion");
                  setpending(false);
                });
            } else {
              const requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify(message),
              };

              await fetch("http://127.0.0.1:8080/getEmotion", requestOptions)
                .then((response) => {
                  return response.json();
                })
                .then(async (data) => {
                  console.log(doc.id, data.context, data.emotion);
                  await db
                    .collection("rooms")
                    .doc(roomId)
                    .collection("messages")
                    .doc(doc.id)
                    .update({ emotion: data.emotion })
                    .then((data) => {
                      console.log("Got Emotion From ML: " + data.emotion);
                      setpending(false);
                    })
                    .catch((err) => {
                      console.log("Unable To Get Emotion");
                      setpending(false);
                    });
                  return data;
                })
                .catch((err) => {
                  console.log("Unable To Get Emotion");
                  setpending(false);
                });
            }
            // console.log(id, message.context, message.emotion);
          }
        });
      })
      .catch(function (error) {
        console.log("Error getting message Id");
      });
    // message = {};
  };

  return (
    <div className="chat">
      <div className="chat__header">
        {room.photo ? (
          <img src={room.photo} alt={user.name} id="photo" />
        ) : (
          <Avatar />
        )}

        <div className="chat__headerInfo">
          <h3>{room.name}</h3>
          <p>
            {room.timestamp && new Date(room.timestamp.toDate()).toUTCString()}
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
        {/* <Loaders /> */}
        {messages &&
          user &&
          messages.map((message) => (
            <p
              className={`chat__message ${
                message.name === user.name && "chat__receiver"
              }`}
              key={message.id}
              onClick={(e) => getEmotion(message, e)}
            >
              {message.context}
              <span className="chat__name">{message.name}</span>
              <span className="chat__timestamp">
                {message.timestamp &&
                  new Date(message.timestamp.toDate()).toUTCString()}
              </span>
              <span className="chat__emoji">
                {message.emotion && emoji[message.emotion] ? (
                  emoji[message.emotion]
                ) : pending ? (
                  <Loaders />
                ) : (
                  ""
                )}
              </span>
            </p>
          ))}
        <div className="chat__emojipicker"></div>
        {picker && <Picker onEmojiClick={onEmojiClick} />}
      </div>

      <div className="chat__footer">
        <IconButton onClick={pickerHandler}>
          <InsertEmoticonIcon />
        </IconButton>

        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message"
            type="search"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        {/* <IconButton> */}
        <MicIcon />
        {/* </IconButton> */}
      </div>
    </div>
  );
}

export default Chat;
