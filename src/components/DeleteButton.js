import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";
import {
  DELETE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
  FETCH_POSTS_QUERY,
} from "../utils/graphql";

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      //closes confirm module
      setConfirmOpen(false);
      //remove post from cache*******
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter((p) => p.id !== postId),
          },
        });
        //redirects to home page
        if (callback) callback();
      }
    },
    variables: { postId, commentId },
  });
  return (
    <>
      <Popup
        content={commentId ? "Delete comment" : "Delete post"}
        inverted
        trigger={
          <Button
            as="div"
            color="red"
            floated="right"
            onClick={() => setConfirmOpen(true)}
          >
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        }
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
};

export default DeleteButton;
