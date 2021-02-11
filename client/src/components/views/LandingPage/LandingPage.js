import React, { useEffect, useState } from "react";
import Axios from "axios";
import moment from "moment";
import { Col, Card, Avatar, Typography, Row } from "antd";
const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
  const [Video, setVideo] = useState([]);
  const renderCards = Video.map((video, index) => {
    console.log(video);
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);
    return (
      <Col key={index} lg={6} md={8} xs={24}>
        <a href={`/video/${video._id}`}>
          <div style={{ position: "relative" }}>
            <img
              style={{ width: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumdnail"
            />
            <div className="duration">
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </div>
        </a>
        <br />
        <Meta // 유저 이미지
          avatar={<Avatar src={video.writer.image} />}
          title={video.title}
          description=""
        />
        <span>{video.writer.name}</span>
        <br />
        <span style={{ marginLeft: "3rem" }}>{video.views} views</span> -
        <span>{moment(video.createdAt).format("MMM Do YY")}</span>
      </Col>
    );
  });

  useEffect(() => {
    // dom 로드 되자마자 한 번만 실행 / []차 있으면 재실행
    Axios.get("/api/video/getVideos").then((res) => {
      if (res.data.success) {
        setVideo(res.data.videos);
      } else {
        alert("비디오 불러오기 실패");
      }
    });
  }, []);

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}> Recommended</Title>
      <hr />
      <Row gutter={[32, 16]}>{renderCards}</Row>
    </div>
  );
}

{
}

export default LandingPage;
