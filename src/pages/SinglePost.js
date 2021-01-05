import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import React, { useContext, useRef, useState } from "react";
import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Image,
  Label,
  Popup,
} from "semantic-ui-react";
import DeleteButton from "../components/DeleteButton";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";
import { CREATE_COMMENT_MUTATION, FETCH_POST_QUERY } from "../utils/graphql";

const SinglePost = (props) => {
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;
  const commentInputRef = useRef(null);
  const [comment, setComment] = useState("");

  const deletePostCallback = () => {
    props.history.push("/");
  };

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

  let postMarkup;
  if (!data) {
    postMarkup = <p>loading...</p>;
  } else {
    const {
      id,
      username,
      body,
      createdAt,
      likes,
      likeCount,
      comments,
      commentCount,
    } = data.getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="right"
              size="small"
              src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Popup
                  content="Comment on post"
                  inverted
                  trigger={
                    <Button as="div" labelPosition="right">
                      <Button color="teal" basic>
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="teal" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  }
                />
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={createComment}
                      >
                        Comment
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>
                    {moment(comment.createdAt).fromNow(true)}
                  </Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
};

export default SinglePost;
