import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import { useSelector } from "react-redux";
import Axios from "axios";
import LikeDislike from "./LikeDislike";

const { TextArea } = Input;

function SingleComment(props) {
  const [OpenReply, setOpenReply] = useState(false);
  const [Commentvalue, setCommentvalue] = useState("");
  const user = useSelector((state) => state.user);
  const userId = user.userData._id;
  const onSubmit = (e) => {
    e.preventDefault();
    const variable = {
      content: Commentvalue,
      writer: userId, // redux에서 정보 가져오기
      postId: props.postId,
      responseTo: props.comment._id, // 부모 댓글 comment id 값
    };
    Axios.post("/api/comment/saveComment", variable).then((res) => {
      if (res.data.success) {
        props.refreshFunction(res.data.result);
        setCommentvalue("");
        setOpenReply(false);
      } else {
        alert("댓글 못 달아");
      }
    });
  };
  const onClickReplyopen = () => {
    setOpenReply(!OpenReply);
  };

  const actions = [
    <LikeDislike
      commentId={props.comment._id}
      userId={localStorage.getItem("userId")}
    />,
    <span onClick={onClickReplyopen} key="comment-basic-reply-to">
      Reply to
    </span>,
  ];

  const onHandleChange = (e) => {
    setCommentvalue(e.currentTarget.value);
  };
  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt="image" />}
        content={<p>{props.comment.content}</p>}
      >
        {OpenReply && ( // 부모 comment에 자식 comment 집어넣기
          <form style={{ display: "flex" }} onSubmit={onSubmit}>
            <TextArea
              style={{ width: "100%", borderRadius: "5px" }}
              onChange={onHandleChange}
              value={Commentvalue}
              placeholder="코멘트를 작성해주세요"
            />
            <br />
            <button style={{ width: "15%", height: "52px" }} onClick={onSubmit}>
              Submit
            </button>
          </form>
        )}
      </Comment>
    </div>
  );
}

export default SingleComment;
