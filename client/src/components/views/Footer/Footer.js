import React from "react";
import { Icon } from "antd";

function Footer() {
  return (
    <div
      style={{
        width: "100%",
        height: "80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
      }}
    >
      <p>
        {" "}
        Happy Coding <Icon type="smile" />
      </p>
    </div>
  );
}

export default Footer;
