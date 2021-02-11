const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

//STORAGE MULTER CONFIG
let storage = multer.diskStorage({
  //config 옵션임
  destination: (req, file, cb) => {
    // 어디에다가 저장할 지
    cb(null, "uploads/"); // 폴더에 저장한다
  },
  filename: (req, file, cb) => {
    // 어떠한 파일 name으로 저장할 지
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

//프론트에서 막자
// const uploadFilter = function (req, file, cb) {
//   const ext = path.extname(file.originalname);

//   if (ext !== ".mp4") {
//     // 만약 png 추가 시키고 싶으면   || ext !==".png"
//     cb(res.status(400).end("only  mp4 is allowed"), false);
//   } // 필터 기능으로 골라내기
//   cb(null, true);
// };

var upload = multer({ storage: storage }).single("file");

//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {
  // 비디오를 서버에 저장한다. ->npm install multer --save 비디오 저장
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/thumbnail", (req, res) => {
  // 썸네일 생성 하고 비디오 러닝타임도 가져오기

  // 비디오 정보 가져오기

  let thumbsFilePath = "";
  let fileDuration = "";
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });

  //썸네일 생성
  ffmpeg(req.body.url) // 클라이언트에서 온 비디오 저장 경로
    .on("filenames", function (filenames) {
      // 파일이름 생성
      console.log("Will generate" + filenames.join(", "));
      console.log(filenames);

      thumbsFilePath = "uploads/thumbnails/" + filenames[0]; // 파일 생성해주자
    })
    .on("end", function () {
      //생성하고 무엇을 할 것 인가
      console.log("Screenshots taken");
      return res.json({
        success: true,
        url: thumbsFilePath,
        fileDuration: fileDuration,
      });
    })
    .on("error", function (err) {
      // err날 시
      console.error(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      // 옵션
      //Will take screenshots at 20%, 40%, 60% and 80% of the video
      count: 1, // 썸네일 수
      folder: "uploads/thumbnails",
      size: "320x240",
      //'%b' :input basename (filename w/o extension)
      filename: "thumbnail-%b.png", //%b 파일 원래 이름
    });
});

router.post("/uploadVideo", (req, res) => {
  // 비디오 정보들을 저장한다
  const video = new Video(req.body);
  video.save((err, doc) => {
    console.log(err);
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  }); // 저장하기
});

router.get("/getVideos", (req, res) => {
  //비디오를 DB에서 가져와서 클라이언트에 보낸다
  Video.find()
    .populate("writer") //populate-> writer 에 있는 ref에 해당 objectId가 속해있는 모델을 가져올 수 있다 해당 writer의 정보까지 다 넘겨줄 수 있음
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

router.post("/getVideoDetail", (req, res) => {
  //클라이언트에 보낸다
  Video.findOne({ _id: req.body.videoId })
    .populate("writer")
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videoDetail });
    });
});

module.exports = router;

//npm install fluent-ffmpeg --save
