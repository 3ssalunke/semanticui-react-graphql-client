import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { CREATE_POST_MUATATION, FETCH_POSTS_QUERY } from "../utils/graphql";

const PostForm = () => {
  const [values, setValues] = useState({
    body: "",
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [createPost, { error }] = useMutation(CREATE_POST_MUATATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      setValues({ body: "" });
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    createPost();
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>create a post</h2>
        <Form.Field>
          <Form.Input
            type="textArea"
            placeholder="Yo!"
            name="body"
            value={values.body}
            error={error ? true : false}
            onChange={onChange}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message">
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default PostForm;
