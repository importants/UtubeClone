const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscriberSchema = mongoose.Schema(
  {
    userTo: {
      // 구독당한 사람
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userFrom: {
      // 구독한 사람
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Subscriber = mongoose.model("Subscriber", SubscriberSchema);

module.exports = { Subscriber };
