import React, { useEffect, useState, useRef } from "react";

import ChatContent from "../../chatContent/chatContent";
import ChatList from "../../chatlist/chatList";
import UserProfile from "../../userProfile/userProfile";
import "./chatbody.css";
import axios from "axios";
import _ from "lodash";
import { io } from "socket.io-client";

const ChatPage = () => {
  const [loginId, setLoginId] = useState();
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState();
  const [currentChat, setCurrentChat] = useState();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [userMessages, setMessages] = useState([]);
  const [msg, setMsg] = useState();
  const [startChatData, setSartChatData] = useState();
  const [chatUserName, setChatUserName] = useState();

  const isMountedRef = useRef(false);
  const isFirstRun = useRef(true);
  const socket = io("https://socket-chat-app-3v3p.onrender.com");

  useEffect(() => {
    const userid = localStorage.getItem("userId");
    setLoginId(userid);
  }, []);

  useEffect(() => {
    // console.log("arrival use effect");

    // Set the mounted state to true
    isMountedRef.current = true;

    const handleReceiveMessage = (data) => {
      console.log("arrival message :", data);
      if (isMountedRef.current) {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      }
    };

    // Attach the event listener
    socket.on("getMessage", handleReceiveMessage);

    // Clean up the event listener and reset the mounted state when the component unmounts
    return () => {
      isMountedRef.current = false;
      socket.off("getMessage", handleReceiveMessage);
    };
  }, []); // Empty dependency array

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (loginId) {
      // console.log("add user useEffect runs", loginId);
      socket.emit("addUser", loginId);
    }
  }, [loginId]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get(
          `https://socket-chat-app-3v3p.onrender.com/conversation/${loginId}`
        );
        setConversations(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [loginId]);

  useEffect(() => {
    if (conversations) {
      setFilterUsers(
        _.uniq(
          _.flatten(
            _.map(conversations, (item) => {
              // console.log("members: " + item.members);
              return item.members;
            })
          )
        )
      );
    }
  }, [conversations]);

  useEffect(() => {
    const getAllUsers = async () => {
      const res = await axios.get(
        "https://socket-chat-app-3v3p.onrender.com/api/allUsers"
      );
      setAllUsers(res.data);
    };
    getAllUsers();
  }, [conversations]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `https://socket-chat-app-3v3p.onrender.com/messages/${currentChat}`
        );
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  const sendMessages = async () => {
    const message = {
      conversationId: currentChat,
      sender: loginId,
      text: msg,
    };
    const receiverId = currentChat.members.find((m) => m !== loginId);
    try {
      socket.emit("sendMessage", {
        senderId: loginId,
        receiverId: receiverId,
        text: msg,
      });
    } catch (error) {
      console.log("error while sending message", error);
    }

    try {
      const res = await axios.post(
        "https://socket-chat-app-3v3p.onrender.com/messages",
        message
      );
      setMessages([...userMessages, res.data]);
    } catch (error) {
      console.log(error);
    }
    return setMsg("");
  };

  return (
    <div className="main__chatbody">
      <ChatList
        conversation={conversations}
        currentUser={loginId}
        setChatUserName={setChatUserName}
      />

      {/* <ChatContent
        loginId={loginId}
        userMessages={userMessages}
        sendMessages={sendMessages}
        allUsers={allUsers}
        chatUserName={chatUserName}
      /> */}
      <UserProfile />
    </div>
  );
};

export default ChatPage;
