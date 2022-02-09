import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { db, auth, provider } from "./firebase";
import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Login from "./Login";

function App() {
  const [user, setUsers] = useState(JSON.parse(localStorage.getItem("user")));
  const [theme, setTheme] = useState(false);
  // localStorage.setItem("theme", JSON.stringify(theme));
  const signOut = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("user");
      setUsers(null);
    });
  };

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  return (
    <div className="app">
      {!user ? (
        <Login setUsers={setUsers} />
      ) : (
        <div className={theme ? "app__body" : "app__body dark"}>
          <Router>
            <Sidebar
              signOut={signOut}
              user={user}
              theme={theme}
              setTheme={setTheme}
            />
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat />
              </Route>
              <Route path="/" component={null} />
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
