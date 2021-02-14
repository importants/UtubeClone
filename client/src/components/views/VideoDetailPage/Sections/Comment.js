import React, { useState } from "react";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";
import Axios from "axios";
import ReplyComment from "./ReplyComment";

function Comment(props) {
  const [commentValue, setcommentValue] = useState("");
  const user = useSelector((state) => state.user); // state에서 user정보를 가져와서 집어넣기
  const userId = user.userData._id;
  const handleClick = (e) => {
    setcommentValue(e.currentTarget.value);
  };
  const onSubmit = (e) => {
    e.preventDefault(); // refresh 안되게

    const variable = {
      content: commentValue,
      writer: userId, // redux에서 정보 가져오기
      postId: props.postId,
    };
    Axios.post("/api/comment/saveComment", variable).then((res) => {
      if (res.data.success) {
        props.refreshFunction(res.data.result);
        setcommentValue("");
      } else {
        alert("댓글 못 달아");
      }
    });
  };
  if (userId) {
    return (
      <div>
        <br />
        <p> Replies</p>
        <hr />

        {/* comment lists */}
        {props.commentLists &&
          props.commentLists.map((comment, index) => {
            return (
              <React.Fragment key={comment._id}>
                {!comment.responseTo && (
                  // root comments

                  <React.Fragment key={comment._id}>
                    <SingleComment
                      refreshFunction={props.refreshFunction}
                      comment={comment}
                      postId={props.postId}
                    />
                    <ReplyComment
                      refreshFunction={props.refreshFunction}
                      commentLists={props.commentLists}
                      parentCommentId={comment._id}
                      postId={props.postId}
                    />
                  </React.Fragment>
                )}
              </React.Fragment>
            );
          })}

        {/* root comment form */}

        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <textarea
            style={{
              width: "100%",
              borderRadius: "6px",
            }}
            onChange={handleClick}
            value={commentValue}
            placeholder="코멘트를 작성해 주세요"
          ></textarea>
          <br />
          <button style={{ width: "200px", height: "52px" }} onClick={onSubmit}>
            Submit
          </button>
        </form>
      </div>
    );
  } else {
    return <>loading...</>;
  }
}

export default Comment;
