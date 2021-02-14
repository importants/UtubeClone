const express = require("express");
const router = express.Router();
const { Like } = require("../models/Like");
const { DisLike } = require("../models/DisLike");

//=================================
//             like
//=================================

router.post("/getLikes", (req, res) => {
  let variable = {};

  if (req.body.videoId) {
    // 비디오 일때
    variable = { videoId: req.body.videoId };
  } else {
    // 댓글 일때
    variable = { videoId: req.body.commentId };
  }
  Like.find(variable).exec((err, likes) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({
      success: true,
      likes,
    });
  });
});

router.post("/getDisLikes", (req, res) => {
  let variable = {};

  if (req.body.videoId) {
    // 비디오 일때
    variable = { videoId: req.body.videoId };
  } else {
    // 댓글 일때
    variable = { videoId: req.body.commentId };
  }
  DisLike.find(variable).exec((err, dislikes) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({
      success: true,
      dislikes,
    });
  });
});

router.post("/upLike", (req, res) => {
  let variable = {};

  if (req.body.videoId) {
    // 비디오 일때
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    // 댓글 일때
    variable = { videoId: req.body.commentId, userId: req.body.userId };
  }
  // 클릭 정보를 collection에 집어넣기
  const like = new Like(variable);

  like.save((err, likeResult) => {
    if (err) return res.status(400).send(err);
    // 만약에 Dislike 가 이미 클릭이 되있다면, DisLike 1 줄여준다
    DisLike.findOneAndDelete(variable).exec((err, dislikes) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({
        success: true,
      });
    });
  });
});

router.post("/downLike", (req, res) => {
  let variable = {};

  if (req.body.videoId) {
    // 비디오 일때
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    // 댓글 일때
    variable = { videoId: req.body.commentId, userId: req.body.userId };
  }
  // 삭제
  Like.findOneAndDelete(variable).exec((err, likes) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({
      success: true,
    });
  });
});

router.post("/upDisLike", (req, res) => {
  let variable = {};

  if (req.body.videoId) {
    // 비디오 일때
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    // 댓글 일때
    variable = { videoId: req.body.commentId, userId: req.body.userId };
  }
  // 클릭 정보를 collection에 집어넣기
  const dislike = new DisLike(variable);

  dislike.save((err, dislikeResult) => {
    if (err) return res.status(400).send(err);
    // 만약에 Dislike 가 이미 클릭이 되있다면, DisLike 1 줄여준다
    Like.findOneAndDelete(variable).exec((err, likes) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({
        success: true,
      });
    });
  });
});

router.post("/downDisLike", (req, res) => {
  let variable = {};

  if (req.body.videoId) {
    // 비디오 일때
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    // 댓글 일때
    variable = { videoId: req.body.commentId, userId: req.body.userId };
  }
  // 삭제
  DisLike.findOneAndDelete(variable).exec((err, dislikes) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({
      success: true,
    });
  });
});

module.exports = router;
