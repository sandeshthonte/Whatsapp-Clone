import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import db from "./firebase";
import { Link } from "react-router-dom";
import firebase from "firebase";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

function SidebarChat({ id, name, addNewChat, photo, timestamp, theme }) {
  const [heeey, setSeed] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUsers] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, []);

  const createChat = () => {
    console.log(timestamp);
    const roomName = prompt("Please enter name for chat");

    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
        photo: user.photo,
        createdBy: user.name,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  return !addNewChat ? ( //conditions in custom template
    <Link
      to={`/rooms/${id}`}
      className={theme ? "roomLink" : "roomLink darkroomLink"}
    >
      <div className="sidebarChat">
        {photo ? (
          <img src={photo} alt={name} id="photo" />
        ) : (
          <Avatar src={`https://avatars.dicebear.com/api/human/${heeey}.svg`} />
        )}

        <div
          className={
            theme
              ? "sidebarChat__info"
              : "sidebarChat__info darksidebarChat__info"
          }
        >
          <h3>{name}</h3>
          <p>{timestamp}</p>
          <p>Hii</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <AddCircleOutlineIcon />
      <div className="sidebarChat__info">
        <h3>Add New Room</h3>
      </div>
    </div>
  );
}

export default SidebarChat;
