import React, { useState } from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";
import { GET_POSTS } from "../Posts";
import styles from "./styles.module.css";

const CREATE_POST_MUTATION = gql`
  mutation createPost($title: String!, $body: String!, $authorUuid: Int!) {
    createPost(title: $title, body: $body, authorUuid: $authorUuid) {
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

const AddPost = ({ authorUuid }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const submitPost = useMutation(CREATE_POST_MUTATION, {
    update: (proxy, { data: { createPost } }) => {
      const data = proxy.readQuery({
        query: GET_POSTS
      });
      const newData = {
        ...data,
        viewer: {
          ...data.viewer,
          allPosts: {
            ...data.viewer.allPosts,
            edges: [
              ...data.viewer.allPosts.edges,
              {
                node: createPost.post,
                __typename: "PostObjectEdge"
              }
            ]
          }
        }
      };
      proxy.writeQuery({
        query: GET_POSTS,
        data: newData
      });
      setTitle("");
      setBody("");
    },
    variables: {
      title: title,
      body: body,
      authorUuid: authorUuid
    }
  });

  return (
    <div className={styles.container}>
      <h1>Add Post</h1>
      <div className={styles.controls}>
        <div>Save</div>
      </div>
      <input
        id="standard-title"
        label="Title"
        className={styles.textField}
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        id="standard-body"
        label="Body"
        value={body}
        onChange={e => setBody(e.target.value)}
        className={styles.textField}
      />
    </div>
  );
};

AddPost.propTypes = {
  createPost: PropTypes.func
};

export default AddPost;
