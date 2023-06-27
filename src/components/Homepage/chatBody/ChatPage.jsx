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

  // Check if the socket ID is stored in localStorage
  const storedSocketId = localStorage.getItem("socketId");

  // Connect to the socket server using the stored socket ID or generate a new one
  const socket = io("https://socket-chat-app-3v3p.onrender.com", {
    query: {
      socketId: storedSocketId || null,
    },
  });

  useEffect(() => {
    const userid = localStorage.getItem("userId");
    setLoginId(userid);
  }, []);

  useEffect(() => {
    // Store the socket ID in localStorage when the connection is established
    socket.on("connect", () => {
      const socketId = socket.id;
      localStorage.setItem("socketId", socketId);
    });

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
    console.log("arrivals message", arrivalMessage);
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (loginId && socket) {
      if (socket.connected) {
        socket.emit("addUser", loginId);
      } else {
        socket.on("connect", () => {
          socket.emit("addUser", loginId);
        });
      }
    }
  }, [loginId, socket]);

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
          `https://socket-chat-app-3v3p.onrender.com/messages/${currentChat._id}`
        );

        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  const sendMessages = async () => {
    // console.log("currentchat", currentChat);

    const message = {
      conversationId: currentChat._id,
      sender: loginId,
      text: msg,
    };
    const receiverId = currentChat.members.find((m) => m !== loginId);

    // console.log("receiverId: ", receiverId);

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
      setMsg(" ");
      setMessages([...userMessages, res.data]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="main__chatbody">
      <ChatList
        setChatUserName={setChatUserName}
        setCurrentChat={setCurrentChat}
      />

      <ChatContent
        loginId={loginId}
        userMessages={userMessages}
        sendMessages={sendMessages}
        allUsers={allUsers}
        chatUserName={chatUserName}
        setMsg={setMsg}
        msg={msg}
      />
      <UserProfile />
    </div>
  );
};

export default ChatPage;
