import React from "react";
import ReactDOM from "react-dom";
import { Router, Route } from "react-router-dom";
import { ApolloProvider } from "react-apollo-hooks";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, concat } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import createHistory from "history/createBrowserHistory";
import { isAuthenticated, unAuthenticate } from "./utils";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const history = createHistory();

const httpLink = new HttpLink({ uri: "http://localhost:5000/graphql" });

const authErrorLink = onError(({ graphQLErrors }) => {
  const hasUnauthorized =
    graphQLErrors &&
    graphQLErrors.find(error => {
      const { message } = error;
      return message.includes("expired");
    });
  if (hasUnauthorized) {
    unAuthenticate();
    history.push("/login");
  }
});

const cache = new InMemoryCache();

const authMiddleware = new ApolloLink((operation, forward) => {
  if (isAuthenticated()) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    });
  }
  return forward(operation);
});

const client = new ApolloClient({
  link: authErrorLink.concat(concat(authMiddleware, httpLink)),
  cache: cache
});

const Main = () => (
  <ApolloProvider client={client}>
    <Router history={history}>
      <div>
        <Route path="/" component={App} />
      </div>
    </Router>
  </ApolloProvider>
);

ReactDOM.render(<Main />, document.getElementById("root"));

serviceWorker.unregister();
