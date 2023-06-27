import React, { useEffect, useState } from "react";
import Avatar from "../chatlist/Avatar";
import axios from "axios";

const ChatItems = (props) => {
  // console.log("caht props", props.user);

  // console.log("loginId", props.loginId);
  // console.log("senderId", props.user.sender);

  // const [profileImg, setProfileImg] = useState();

  // useEffect(() => {
  //   if (props.user.sender) {
  //     const getUserImg = async () => {
  //       const response = await axios.get(
  //         "https://socket-chat-app-3v3p.onrender.com/api/getone?userId=" +
  //           props.user.sender
  //       );
  //       console.log("response: ", props.loginId !== response.data._id);
  //       setProfileImg(response.data);
  //     };
  //     getUserImg();
  //   }
  // }, []);

  return (
    <div
      style={{ animationDelay: `0.8s` }}
      className={`chat__item ${
        props.user && props.user.sender === props.loginId ? "me" : "other"
      }`}
    >
      <div className="chat__item__content">
        <div className="chat__msg">{props.msg}</div>
        <div className="chat__meta">
          <span>16 mins ago</span>
          <span>Seen 1.03PM</span>
        </div>
      </div>
      <Avatar isOnline="active" image={props.image} />
    </div>
  );
};

export default ChatItems;
