import React, { useState } from "react";
import { useMutation } from "react-apollo-hooks";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import gql from "graphql-tag";
import Button from "../Button";
import styles from "./styles.module.css";

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      user {
        username
        uuid
      }
      authToken
    }
  }
`;

const Signup = props => {
  const { location, history } = props;
  const { from } = location.state || { from: { pathname: "/" } };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const signup = useMutation(SIGNUP_MUTATION, {
    update: (proxy, { data }) => {
      if (data && data.signup && data.signup.user) {
        localStorage.setItem("user", JSON.stringify(data.signup.user));
        localStorage.setItem("authToken", data.signup.authToken);
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
          signup();
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
        <Button text="Signup" type="submit" />
      </form>
    </div>
  );
};

export default Signup;
