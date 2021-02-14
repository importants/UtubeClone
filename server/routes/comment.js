const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Comment } = require("../models/Comment");

//=================================
//             Comment
//=================================

router.post("/saveComment", (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });

    // return res.status(200).json({
    //     success: true,
    //     //comment, 이 상태로는 writer의 정보를 줄 수 없다
    //   });
    Comment.find({ _id: comment._id }) //writer의 정보를 줄 수 있다.
      .populate("writer")
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
          success: true,
          result,
        });
      });
  });
});

router.post("/getComments", (req, res) => {
  Comment.find({ postId: req.body.videoId })
    .populate("writer")
    .exec((err, comments) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({
        success: true,
        comments,
      });
    });
});

module.exports = router;
