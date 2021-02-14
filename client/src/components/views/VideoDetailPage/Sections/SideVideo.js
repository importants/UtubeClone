import Axios from "axios";
import React, { useState, useEffect } from "react";

function SideVideo() {
  const [sideVideos, setsideVideos] = useState([]);

  useEffect(() => {
    // dom 로드 되자마자 한 번만 실행 / []차 있으면 재실행
    Axios.get("/api/video/getVideos").then((res) => {
      if (res.data.success) {
        setsideVideos(res.data.videos);
      } else {
        alert("비디오 불러오기 실패");
      }
    });
  }, []);

  const renderSideVideo = sideVideos.map((video, index) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);
    return (
      <div key={index} style={{ display: "flex", marginBottom: "0 2rem" }}>
        <div
          style={{ width: "40%", marginBottom: "1rem", marginRight: "1rem" }}
        >
          <a href="#">
            <img
              style={{ width: "100%", height: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
          </a>
        </div>
        <div style={{ width: "50%" }}>
          <a href={`/video/${video._id}`} style={{ color: "gray" }}>
            <span style={{ fontSize: "1rem", color: "black" }}>
              {video.title}
            </span>
            <br />
            <span>{video.writer.name}</span>
            <br />
            <span>{video.views} views</span>
            <br />
            <span>
              {minutes}: {seconds}
            </span>
          </a>
        </div>
      </div>
    );
  });

  return (
    <React.Fragment>
      <div style={{ marginTop: "3rem" }}>{renderSideVideo}</div>
    </React.Fragment>
  );
}

export default SideVideo;
