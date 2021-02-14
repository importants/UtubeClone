import React, { useState, useEffect } from "react";
import SingleComment from "./SingleComment";

function ReplyComment(props) {
  const [OpenReplyComments, setOpenReplyComments] = useState(false);
  const [ChildCurruentnumber, setChildCurruentnumber] = useState(0);
  useEffect(() => {
    let commentNumber = 0;
    props.commentLists.map((comment) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++; // 같으면 하나하나씩 늘어나게 한다
      }
    });
    setChildCurruentnumber(commentNumber);
  }, [props.commentLists]); // 이게 바뀔 때마다 refresh

  const onHandChange = () => {
    setOpenReplyComments(!OpenReplyComments);
  };
  return (
    <div>
      {ChildCurruentnumber > 0 && (
        <p
          style={{
            fontSize: "14px",
            margin: 0,
            color: "gray",
            cursor: "pointer",
          }}
          onClick={onHandChange}
        >
          view {ChildCurruentnumber} more comment(s)
        </p>
      )}

      {OpenReplyComments &&
        props.commentLists.map((comment, index) => {
          return (
            comment.responseTo === props.parentCommentId && (
              // 부모 comment의 id와 자식의 responseTo id 값이 같으면 나오게 한다

              <div
                key={comment._id}
                style={{ width: "80%", marginLeft: "40px" }}
              >
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
              </div>
            )
          );
        })}
    </div>
  );
}

export default ReplyComment;
