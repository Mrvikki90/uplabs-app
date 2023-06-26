import React, { useEffect, useState } from "react";
import axios from "axios";

import Avatar from "./Avatar";
import { SERVE_STATIC_IMAGES_PATH } from "../constants/constant";

const ChatListItems = ({
  conversation,
  currentUser,
  animationDelay,
  setChatUserName,
}) => {
  console.log("conversation", conversation);

  // const [user, setUser] = useState();

  // useEffect(() => {
  //   const friendId = conversation.members.find((m) => m !== currentUser);

  //   console.log("friendId: " + friendId);

  //   const getUser = async () => {
  //     try {
  //       const res = await axios.get(
  //         "https://socket-chat-app-3v3p.onrender.com/api/getone?userId=" +
  //           friendId
  //       );
  //       setUser(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getUser();
  // }, [currentUser, conversation]);

  // const selectChat = (e) => {
  //   for (
  //     let index = 0;
  //     index < e.currentTarget.parentNode.children.length;
  //     index++
  //   ) {
  //     e.currentTarget.parentNode.children[index].classList.remove("active");
  //   }
  //   e.currentTarget.classList.add("active");
  // };

  return (
    <div
      style={{ animationDelay: `0.${animationDelay}s` }}
      // onClick={selectChat}
      className={`chatlist__item active`}
    >
      <Avatar
        image={
          conversation && conversation.profileImg
            ? `${SERVE_STATIC_IMAGES_PATH}${conversation.profileImg}`
            : "images/logo.png"
        }
        // isOnline={props.isOnline}
      />

      <div
        className="userMeta"
        onClick={() => setChatUserName(conversation.name)}
      >
        <p>{conversation && conversation?.name}</p>
        <span className="activeTime">32 mins ago</span>
      </div>
    </div>
  );
};

export default ChatListItems;
