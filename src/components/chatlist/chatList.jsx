import React, { useEffect, useState } from "react";
import "./chatlist.css";
import ChatListItems from "./chatListItems";
import axios from "axios";
import _ from "lodash";

const ChatList = ({ conversation, currentUser, setChatUserName }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser);

    console.log("friendId: " + friendId);

    const getUser = async () => {
      try {
        const res = await axios.get(
          "https://socket-chat-app-3v3p.onrender.com/api/getone?userId=" +
            friendId
        );
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="main__chatlist">
      <div className="align-div">
        <button className="btn">
          <div className="chatlistadd">
            <span>New conversation</span>
            <i className="fa fa-plus"></i>
          </div>
        </button>
        <div className="chatlist__heading">
          <h3>Chats</h3>
        </div>
        <div className="chatList__search">
          <div className="search_wrap">
            <input type="text" placeholder="Search Here" required />
            <button className="search-btn">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="chatlist__items">
        {conversation &&
          conversation.map((item, index) => {
            return (
              <ChatListItems
                key={index}
                conversation={user}
                currentUser={currentUser}
                animationDelay={index + 1}
                setChatUserName={setChatUserName}
              />
            );
          })}

        {/* {allChatUsers.map((item, index) => {
          return (
            <ChatListItems
              name={item.name}
              key={item.id}
              animationDelay={index + 1}
              active={item.active ? "active" : ""}
              isOnline={item.isOnline ? "active" : ""}
              image={item.image}
            />
          );
        })} */}
      </div>
    </div>
  );
};

export default ChatList;
