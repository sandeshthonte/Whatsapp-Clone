import React, { useState } from "react";
import "./SidebarChat.css";
import { Avatar, IconButton } from "@material-ui/core";
import db from "./firebase";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase/app";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteIcon from "@material-ui/icons/Delete";

function SidebarChat({ id, name, addNewChat, photo, timestamp, theme, room }) {
  const [user, setUsers] = useState(JSON.parse(localStorage.getItem("user")));
  const history = useHistory();

  const createGroup = () => {
    const roomName = prompt("Group Name");

    if (roomName) {
      console.log(user);
      db.collection("rooms")
        .add({
          name: roomName,
          photo: user.photo,
          createdBy: user.name,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => console.log("Group Created"))
        .catch((err) => console.log(err));
    }
  };

  const deleteGroup = (id, e) => {
    e.preventDefault();
    if (id) {
      history.replace("/rooms");
      // const jobskills = db
      //   .collection("rooms")
      //   .where("id", "==", id)
      //   .get();

      // db.collection("rooms")
      //   .where("id", "==", id)
      //   .get()
      //   .then((querySnapshot) => {

      //     querySnapshot.forEach((doc) => {
      //       doc.ref.delete();
      //     });
      //   })
      //   .catch((err) => console.log("Unable To Delete Group"));
      // db.collection("rooms").doc(id).collection("messages").l
      db.collection("rooms") //doubt
        .doc(id)
        .collection("messages")
        .listDocuments()
        .then((val) => {
          val.map((val) => val.delete());
        });
      db.collection("rooms")
        .doc(id)
        .delete()
        .then(() => {
          console.log("Deleted Group");
          // history.push(id);
        })
        .catch(() => console.log("Unable To Delete Group"));
    }
  };

  return !addNewChat ? ( //conditions in custom template
    <Link
      to={`/rooms/${id}`}
      className={theme ? "roomLink" : "roomLink darkroomLink"}
    >
      <div className="sidebarChat">
        {photo ? <img src={photo} alt={name} id="photo" /> : <Avatar />}
        <div
          className={
            theme
              ? "sidebarChat__info"
              : "sidebarChat__info darksidebarChat__info"
          }
        >
          <h3>{name}</h3>
          <p>{timestamp && new Date(timestamp.toDate()).toUTCString()}</p>
        </div>
        <IconButton onClick={(e) => deleteGroup(id, e)}>
          <DeleteIcon />
        </IconButton>
      </div>
    </Link>
  ) : (
    <div onClick={createGroup} className="sidebarChat">
      <AddCircleOutlineIcon />
      <div className="sidebarChat__info">
        <h3>New Group</h3>
      </div>
    </div>
  );
}

export default SidebarChat;
