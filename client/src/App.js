import React from "react";
import "./App.css";
import PropTypes from "prop-types";

import { Route, NavLink, Redirect } from "react-router-dom";

import NavBar from "./components/NavBar";
import Button from "./components/Button";
import Posts from "./components/Posts";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./PrivateRoute";
import { isAuthenticated, unAuthenticate } from "./utils";
import { AuthContext } from "./auth-context";

const App = ({ location, history }) => {
  return (
    <AuthContext.Provider value={{ user: isAuthenticated() }}>
      <div className="root">
        <NavBar>
          <div>LaughQL{location.pathname}</div>
          {isAuthenticated() ? (
            <Button
              text="Logout"
              click={() => {
                unAuthenticate();
                history.push("/login");
              }}
            />
          ) : (
            <div>
              <Button text="Signup" click={() => history.push("/login")} />
              <Button text="Login" click={() => history.push("/login")} />
            </div>
          )}
        </NavBar>
        {location.pathname === "/" && <Redirect to="/posts" />}
        <main className="content">
          <Route name="Login" path="/login" component={Login} />
          <Route name="Signup" path="/signup" component={Signup} />
          <PrivateRoute name="Posts" path="/posts" component={Posts} />
        </main>
      </div>
    </AuthContext.Provider>
  );
};

App.propTypes = {
  location: PropTypes.object.isRequired
};

export default App;
