import React, { useState } from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";

import Edit from "../../icons/Edit";

import { useMutation } from "react-apollo-hooks";
import { AuthContext } from "../../auth-context";
import { GET_POSTS } from "../Posts";

import styles from "./styles.module.css";

const UPDATE_POST_MUTATION = gql`
  mutation updatePost($title: String!, $body: String!, $uuid: Int!) {
    updatePost(title: $title, body: $body, uuid: $uuid) {
      post {
        uuid
        author {
          uuid
          username
        }
        body
        title
      }
    }
  }
`;

const DELETE_POST_MUTATION = gql`
  mutation deletePost($uuid: Int!) {
    deletePost(uuid: $uuid) {
      status
    }
  }
`;

const Post = ({ post }) => {
  const removePost = useMutation(DELETE_POST_MUTATION, {
    update: (proxy, { data: { deletePost } }) => {
      const data = proxy.readQuery({
        query: GET_POSTS
      });
      const edges = Object.assign([], data.viewer.allPosts.edges);
      const idx = edges.findIndex(e => e.node.uuid === post.uuid);
      edges.splice(idx, 1);
      const newData = {
        ...data,
        viewer: {
          ...data.viewer,
          allPosts: {
            ...data.viewer.allPosts,
            edges: edges
          }
        }
      };
      proxy.writeQuery({
        query: GET_POSTS,
        data: newData
      });
    },
    variables: {
      uuid: post.uuid
    }
  });

  const [mode, setMode] = useState("list");
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);

  const submitPost = useMutation(UPDATE_POST_MUTATION, {
    update: (proxy, { data: { updatePost } }) => {
      const data = proxy.readQuery({
        query: GET_POSTS
      });
      const edges = Object.assign([], data.viewer.allPosts.edges);
      const idx = edges.findIndex(e => e.node.uuid === post.uuid);
      edges.splice(idx, 1, {
        node: updatePost.post,
        __typename: "PostObjectEdge"
      });
      const newData = {
        ...data,
        viewer: {
          ...data.viewer,
          allPosts: {
            ...data.viewer.allPosts,
            edges: edges
          }
        }
      };
      proxy.writeQuery({
        query: GET_POSTS,
        data: newData
      });
    },
    variables: {
      title: title,
      body: body,
      uuid: post.uuid
    }
  });
  return (
    <div className={styles.container}>
      <AuthContext.Consumer>
        {context => {
          if (
            post.author &&
            context.user &&
            post.author.uuid === context.user.uuid
          ) {
            if (mode === "edit") {
              return (
                <div className={styles.controls}>
                  <div>cancel</div>
                  <div>save</div>
                </div>
              );
            }
            return (
              <div className={styles.controls}>
                <div>Edit</div>
                <div>Delete</div>
              </div>
            );
          }
          return null;
        }}
      </AuthContext.Consumer>
      {mode === "list" ? (
        <h1 className={styles.title}>{post.title}</h1>
      ) : (
        <input
          id="standard-title"
          label="Title"
          className={styles.textField}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      )}
      {post.author ? <small>-- by {post.author.username}</small> : null}
      {mode === "list" ? (
        <p className={styles.body}>{post.body}</p>
      ) : (
        <textarea
          id="standard-body"
          label="Body"
          value={body}
          onChange={e => setBody(e.target.value)}
          className={styles.textField}
        />
      )}
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object,
  deletePost: PropTypes.func
};

export default Post;
