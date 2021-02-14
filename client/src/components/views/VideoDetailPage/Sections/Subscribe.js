import Axios from "axios";
import React, { useEffect, useState } from "react";

function Subscribe(props) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);
  useEffect(() => {
    let variable = {
      userTo: props.userTo,
    };
    Axios.post("/api/subscribe/subscribeNumber", variable).then((res) => {
      if (res.data.success) {
        setSubscribeNumber(res.data.subscribeNumber);
      } else {
        alert("구독 정보를 가져올 수 없습니다");
      }
    });

    let subscribledVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem("userId"),
    };
    Axios.post("/api/subscribe/subscribed", subscribledVariable).then((res) => {
      if (res.data.success) {
        setSubscribed(res.data.subscribed);
      } else {
        alert("구독 정보를 불러오는 것이 정상적으로 이루어지지 않았습니다");
      }
    });
  }, []);

  const onSubscribe = () => {
    let subscribledVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem("userId"),
    };

    // 구독 중이라면
    if (Subscribed) {
      Axios.post("/api/subscribe/unsubscribe", subscribledVariable).then(
        (res) => {
          if (res.data.success) {
            setSubscribeNumber((num) => num - 1);
            setSubscribed(!Subscribed);
          } else {
            alert("구독 취소를 하는데 실패 했습니다");
          }
        }
      );
    }
    //아직 구독 중이 아니라면
    else {
      Axios.post("/api/subscribe/subscribe", subscribledVariable).then(
        (res) => {
          if (res.data.success) {
            setSubscribeNumber((num) => num + 1);
            setSubscribed(!Subscribed);
          } else {
            alert("구독 하는데 실패했습니다");
          }
        }
      );
    }
  };

  return (
    <>
      <button
        style={{
          background: `${Subscribed ? "#AAAAAA" : "#CC0000"}`,
          borderRadius: "4px",
          color: "white",
          padding: " 10px 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase",
          border: "none",
          cursor: "pointer",
        }}
        onClick={onSubscribe}
      >
        {`${SubscribeNumber}`} {Subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </>
  );
}

export default Subscribe;
