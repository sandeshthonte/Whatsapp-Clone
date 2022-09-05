import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";
import ToggleSwitch from "@material-ui/core/Switch";
import SidebarChat from "./SidebarChat";
import db from "./firebase";

function Sidebar({signOut, user, theme, setTheme}) {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    ); //on any change in this snapshot run this code
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <IconButton onClick={signOut}>
          {user.photo ? <img src={user.photo} alt={user.name} id="photo" /> : <Avatar />}
        </IconButton>
        <div className="sidebar__headerRight">
          <ToggleSwitch value={theme} onClick={() => setTheme(!theme)} />
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          {/* <IconButton>
            <MoreVertIcon />
          </IconButton> */}
          <IconButton>
            <MenuIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <IconButton>
            <SearchIcon />
          </IconButton>
          
          <input placeholder="Search" text="text" />
        </div>
      </div>
      <div
        className={
          theme ? "sidebar__chats" : "sidebar__chats darksidebar_chats"
        }
      >
        <SidebarChat addNewChat theme />
        {rooms.map((room) => (
          <SidebarChat
            key={room.id}
            id={room.id}
            name={room.data.name}
            photo={room.data.photo}
            timestamp={room.data.timestamp}
            room = {room.data}
            theme
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
