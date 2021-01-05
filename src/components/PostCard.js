/* eslint-disable react/jsx-no-duplicate-props */
import moment from "moment";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Icon, Image, Label, Popup } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import DeleteButton from "./DeleteButton";
import LikeButton from "./LikeButton";

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);
  const {
    id,
    body,
    username,
    createdAt,
    likes,
    // comments,
    likeCount,
    commentCount,
  } = post;

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Popup
          content="Comment on post"
          inverted
          trigger={
            <Button
              as="div"
              labelPosition="right"
              as={Link}
              to={`/posts/${id}`}
            >
              <Button color="teal" basic>
                <Icon name="comments" />
              </Button>
              <Label basic color="teal" pointing="left">
                {commentCount}
              </Label>
            </Button>
          }
        />
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
