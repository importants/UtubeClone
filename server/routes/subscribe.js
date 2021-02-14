const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");

//=================================
//             User
//=================================

router.post("/subscribeNumber", (req, res) => {
  Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribe) => {
    //subscribe안에는 구독한 사람(userFrom) / 구독당한 사람(userTo) 이 있다
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, subscribeNumber: subscribe.length });
  });

  router.post("/subscribed", (req, res) => {
    let result = false;
    Subscriber.find({
      userTo: req.body.userTo,
      userFrom: req.body.userFrom,
    }).exec((err, subscribe) => {
      //subscribe안에는 구독한 사람(userFrom) / 구독당한 사람(userTo) 이 있다
      if (err) return res.status(400).send(err);
      if (subscribe.length !== 0) {
        result = true;
      } // 구독한 정보가 있을 때 true 없으면 false
      res.status(200).json({ success: true, subscribed: result });
    });
  });

  router.post("/subscribe", (req, res) => {
    let subscriber = new Subscriber(req.body);
    subscriber.save((err, doc) => {
      //subscribe안에는 구독한 사람(userFrom) / 구독당한 사람(userTo) 이 있다
      if (err) return res.status(400).json({ err, success: false });

      res.status(200).json({ success: true });
    });
  });

  router.post("/unsubscribe", (req, res) => {
    Subscriber.findOneAndDelete({
      userTo: req.body.userTo,
      userFrom: req.body.userFrom,
    }).exec((err, doc) => {
      //subscribe안에는 구독한 사람(userFrom) / 구독당한 사람(userTo) 이 있다
      if (err) return res.status(400).json({ err, success: false });

      res.status(200).json({ success: true, doc });
    });
  });
});

module.exports = router;
