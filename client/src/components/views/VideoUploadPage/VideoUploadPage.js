import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import Axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOption = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];
const CategoryOption = [
  { value: 0, label: "Film & Animation" },
  { value: 0, label: "Autos & Vehicles" },
  { value: 0, label: " Music" },
  { value: 0, label: "Pets & Animals" },
];

//npm install react-dropzone --save
function VideoUploadPage(props) {
  const user = useSelector((state) => state.user); //store에 가서 user 데려오기
  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState("Film & Animation");
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };

  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value);
  };

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  };

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);
    // 파일을 보낼 때는 이런 형식을 같이 보내줘야한다
    Axios.post("/api/video/uploadfiles", formData, config).then((res) => {
      if (res.data.success) {
        let variable = {
          url: res.data.url,
          fileName: res.data.fileName,
        };

        setFilePath(res.data.url);
        Axios.post("/api/video/thumbnail", variable).then((res) => {
          if (res.data.success) {
            setDuration(res.data.fileDuration);
            console.log(res.data.url);
            setThumbnailPath(res.data.url);
          } else {
            alert(res.data.err);
          }
        });
      } else {
        alert("파일 전송 실패");
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault(); // 시작 안할 때는 안하게 방지
    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };
    Axios.post("/api/video/uploadVideo", variables).then((res) => {
      if (res.data.success) {
        console.log(res.data.success);
        message.success("성공적으로 업로드 했다");
        setTimeout(() => {
          props.history.push("/");
        }, 1000);
      } else {
        alert("비디오 업로드에 실패 했습니다");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/*Drop zone*/}
          <Dropzone
            onDrop={onDrop}
            multiple={false}
            maxSize={10000000}
            accept="video/*"
          >
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>
          {/*Thumbnail*/}
          {ThumbnailPath && (
            <div>
              {
                <img
                  src={`http://localhost:5000/${ThumbnailPath}`} // 서버 주소니까
                  alt="thumbnail"
                />
              }
            </div>
          )}
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} vaule={VideoTitle} />
        <br />
        <br />
        <label>description</label>
        <TextArea onChange={onDescriptionChange} vaule={Description} />
        <br />
        <br />

        <select onChange={onPrivateChange}>
          {PrivateOption.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <br />
        <br />

        <select onChange={onCategoryChange}>
          {CategoryOption.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <br />
        <br />

        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
