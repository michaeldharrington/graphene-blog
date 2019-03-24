import React, { useState } from "react";
import { useMutation } from "react-apollo-hooks";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import gql from "graphql-tag";
import Button from "../Button";
import styles from "./styles.module.css";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        username
        uuid
      }
      authToken
    }
  }
`;

const Login = props => {
  const { location, history } = props;
  const { from } = location.state || { from: { pathname: "/" } };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useMutation(LOGIN_MUTATION, {
    update: (proxy, { data }) => {
      if (data && data.login && data.login.user) {
        localStorage.setItem("user", JSON.stringify(data.login.user));
        localStorage.setItem("authToken", data.login.authToken);
        setTimeout(() => {
          history.push(from.pathname);
        }, 0);
      }
    },
    variables: {
      username: username,
      password: password
    }
  });

  return (
    <div className={styles.container}>
      <form
        noValidate
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          login();
        }}
      >
        <input
          required
          id="username"
          label="Username"
          className={styles.textField}
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          required
          id="password"
          label="Password"
          className={styles.textField}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button text="Login" type="submit" />
      </form>
    </div>
  );
};

export default Login;
