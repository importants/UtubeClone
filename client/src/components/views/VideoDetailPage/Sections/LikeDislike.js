import React, { useEffect, useState } from "react";
import { Tooltip, Icon } from "antd";
import Axios from "axios";

function LikeDislike(props) {
  const [Likes, setLikes] = useState(0);
  const [DisLikes, setDisLikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DisLikeAction, setDisLikeAction] = useState(null);
  let variable = {};
  if (props.video) {
    // 비디오의 좋아요 싫어요
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    // 댓글의 좋아요 싫어요
    variable = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    // 좋아요 정보
    Axios.post("/api/like/getLikes", variable).then((res) => {
      if (res.data.success) {
        // 얼마나 많은 좋아요를 받았는지
        setLikes(res.data.likes.length);
        // 내가 이미 그 좋아요를 받았는지
        res.data.likes.map((like) => {
          if (like.userId === props.userId /* 제 자신 */) {
            //likes의 정보 중에서 눌렀다면 벌써 눌른거지요
            setLikeAction("liked"); // 내가 like를 벌써 눌렀다
          }
        });
      } else {
        alert("LIkes의 정보를 가져오지 못했습니다");
      }
    });

    // 싫어요 정보
    Axios.post("/api/like/getDisLikes", variable).then((res) => {
      if (res.data.success) {
        // 얼마나 많은 싫어요를 받았는지
        setDisLikes(res.data.dislikes.length);
        // 내가 이미 그 싫어요를 받았는지
        res.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId /* 제 자신 */) {
            //dislikes의 정보 중에서 눌렀다면 벌써 눌른거지요
            setDisLikeAction("disliked"); // 내가 dislike를 벌써 눌렀다
          }
        });
      } else {
        alert("LIkes의 정보를 가져오지 못했습니다");
      }
    });
  }, []);

  const onLike = () => {
    if (LikeAction === null) {
      // 클릭이 안 되어 있을 때
      Axios.post("/api/like/upLike", variable).then((res) => {
        if (res.data.success) {
          setLikes(Likes + 1);
          setLikeAction("liked");

          if (DisLikeAction !== null) {
            setDisLikes(DisLikes - 1);
            setDisLikeAction(null);
          }
        } else {
          alert("좋아요의 업카운팅이 안됐습니다 ");
        }
      });
    } else {
      //클릭이 되어 있을 때
      Axios.post("/api/like/downLike", variable).then((res) => {
        if (res.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert("좋아요의 다운카운팅이 안됐습니다 ");
        }
      });
    }
  };

  const onDisLike = () => {
    if (DisLikeAction === null) {
      // 클릭이 안 되어 있을 때
      Axios.post("/api/like/upDisLike", variable).then((res) => {
        if (res.data.success) {
          setDisLikes(DisLikes + 1);
          setDisLikeAction("disliked");

          if (LikeAction !== null) {
            // 클릭 되어 있을 때 반대로
            setLikes(Likes - 1);
            setLikeAction(null);
          }
        } else {
          alert("싫어요의 업카운팅이 안됐습니다 ");
        }
      });
    } else {
      //클릭이 되어 있을 때
      Axios.post("/api/like/downDisLike", variable).then((res) => {
        if (res.data.success) {
          setDisLikes(DisLikes - 1);
          setDisLikeAction(null);
        } else {
          alert("싫어요의 다운카운팅이 안됐습니다 ");
        }
      });
    }
  };

  return (
    <div>
      <span key={"comment - basic - like"}>
        <Tooltip title="like">
          <Icon
            type="like"
            theme={LikeAction === "liked" ? "filled" : "outlined"}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}> {Likes} </span>
      </span>
      &nbsp;&nbsp;
      <span key={"comment - basic - dislike"}>
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={DisLikeAction === "disliked" ? "filled" : "outlined"}
            onClick={onDisLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}> {DisLikes} </span>
      </span>
    </div>
  );
}

export default LikeDislike;
