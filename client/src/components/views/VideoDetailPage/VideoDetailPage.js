import React, { useState, useEffect } from "react";
import { Row, Col, List, Avatar } from "antd";
import Axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";
import LikeDislike from "./Sections/LikeDislike";
import { useSelector } from "react-redux";

function VideoDetailPage(props) {
  const [VideoDetail, setVideoDetail] = useState([]);
  const [Comments, setComments] = useState([]);
  const videoId = props.match.params.videoId;
  const variable = {
    videoId,
  };
  const userId = localStorage.getItem("userId"); // localstorage에서 가져오기
  //useSelector((state) => state.user); 리덕스를 이용한 사용자 정보 가져오기

  useEffect(() => {
    Axios.post("/api/video/getVideoDetail", variable).then((res) => {
      if (res.data.success) {
        setVideoDetail(res.data.videoDetail);
      } else {
        alert("정보 불러오기 실패");
      }
    });

    Axios.post("/api/comment/getComments", variable).then((res) => {
      if (res.data.success) {
        setComments(res.data.comments);
      } else {
        alert("코멘트 정보를 불러오기 실패");
      }
    });
  }, []);

  const refreshFunction = (newComment) => {
    setComments(Comments.concat(newComment)); // 바로 댓글 올리면 적용하기 위해서
  };

  if (VideoDetail.writer) {
    const subscribeButton = VideoDetail.writer._id !==
      localStorage.getItem("userId") && (
      <Subscribe userTo={VideoDetail.writer._id} />
    );
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            ></video>
            <List.Item
              actions={[
                <LikeDislike video userId={userId} videoId={videoId} />,
                subscribeButton,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image} />} // 이미지 파일이 나중에 가져와서 undefined가 된다}
                title={VideoDetail.writer.name}
                description={VideoDetail.title}
              />
            </List.Item>
            {/* Comments */}
            {VideoDetail.description}
            <Comment
              refreshFunction={refreshFunction}
              commentLists={Comments}
              postId={videoId}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>loading...</div>;
  }
}

export default VideoDetailPage;
