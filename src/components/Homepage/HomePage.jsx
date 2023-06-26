import React, { useEffect, useState, useRef } from "react";
import {
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Input } from "antd";
import { Icon } from "@chakra-ui/react";
import { RiMessage2Line } from "react-icons/ri";
import { BsTelephone } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { HiOutlineBell } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { IoExitOutline } from "react-icons/io5";
import { GrSearch } from "react-icons/gr";
import { useLocation } from "react-router-dom";
import Conversation from "../convsersations/conversation";
import Messages from "../messages/Messages";
import _ from "lodash";
import axios from "axios";
import ShowUsers from "../Users/ShowUsers";
import { SERVE_STATIC_IMAGES_PATH } from "../constants/constant";
import { io } from "socket.io-client";
import Logout from "../logout/Logout";

const HomePage = () => {
  const location = useLocation();
  const [isChatting, setIsChatting] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState();
  const [currentChat, setCurrentChat] = useState();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [userMessages, setMessages] = useState([]);
  const [msg, setMsg] = useState();
  const [startChatData, setSartChatData] = useState();
  const [chatBoxUserName, setChatBoxUserName] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    user,
    user: { _id },
    user: { profileImg },
  } = location.state;

  // const socket = useRef();
  const isMountedRef = useRef(false);
  const isFirstRun = useRef(true);
  const socket = io("https://socket-chat-app-3v3p.onrender.com");

  useEffect(() => {
    if (isFirstRun.current) {
      console.log("socketStart");
      socket.on("connect", () => {
        console.log("Connected to server", socket);
      });
      isFirstRun.current = false;
    }
  }, [socket]);

  useEffect(() => {
    console.log("arrival use effect");

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
    console.log("add user useEffect runs", user._id);
    socket.emit("addUser", user._id);
  }, []);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get(
          `https://socket-chat-app-3v3p.onrender.com/conversation/${_id}`
        );

        setConversations(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [_id, startChatData]);

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
    const message = {
      conversationId: currentChat._id,
      sender: _id,
      text: msg,
    };
    const receiverId = currentChat.members.find((m) => m !== _id);
    try {
      socket.emit("sendMessage", {
        senderId: _id,
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

  const starChat = async (reciverID) => {
    const res = await axios.post(
      "https://socket-chat-app-3v3p.onrender.com/conversation",
      {
        senderId: _id,
        receiverId: reciverID,
      }
    );
    setSartChatData(res.data);
  };

  useEffect(() => {
    const getAllUsers = async () => {
      const res = await axios.get(
        "https://socket-chat-app-3v3p.onrender.com/api/allUsers"
      );
      setAllUsers(res.data);
    };
    getAllUsers();
  }, [user]);

  return (
    <>
      <Flex h="100vh" direction="column" bgColor="#e6fbff">
        <Flex flexGrow="1">
          <Flex
            margin="0% 0% 1% 1%"
            direction="column"
            alignItems="center"
            bg="#001529"
            px="2"
            justifyContent="space-around"
            w="-webkit-fit-content"
          >
            <Flex>
              <Avatar
                size="lg"
                name="Dan Abrahmov"
                src={`${SERVE_STATIC_IMAGES_PATH}${profileImg}`}
              />
            </Flex>

            <Flex direction="column" gap="10" mb="32">
              <Icon
                color="white"
                as={RiMessage2Line}
                w={6}
                h={6}
                _hover={{ color: "red" }}
                _focus={{ boxShadow: "outline" }}
              />
              <Icon
                color="white"
                as={BsTelephone}
                w={6}
                h={6}
                _hover={{ color: "red" }}
                _focus={{ boxShadow: "outline" }}
              />
              <Icon
                color="white"
                as={CgProfile}
                w={6}
                h={6}
                _hover={{ color: "red" }}
                _focus={{ boxShadow: "outline" }}
              />
              <Icon
                color="white"
                as={HiOutlineBell}
                w={6}
                h={6}
                _hover={{ color: "red" }}
                _focus={{ boxShadow: "outline" }}
              />
            </Flex>
            <Flex direction="column" gap="6" mb="10">
              <Icon
                color="white"
                as={FiSettings}
                w={6}
                h={6}
                _hover={{ color: "red" }}
                _focus={{ boxShadow: "outline" }}
              />
              <Icon
                color="white"
                as={IoExitOutline}
                w={6}
                h={6}
                _hover={{ color: "red" }}
                _focus={{ boxShadow: "outline" }}
                onClick={onOpen}
              />
            </Flex>
          </Flex>
          <Flex flexGrow="1" margin="0% 1% 1% 0%">
            <Flex>
              <Flex bgColor="#BDEDFF" direction="column" alignItems="baseline">
                <Input
                  prefix={<GrSearch className="site-form-item-icon" />}
                  type="text          "
                  placeholder="search"
                  style={{
                    width: "250px",
                    margin: "25px",
                    borderRadius: "15px",
                  }}
                />
                <Heading fontSize="2xl">Chats</Heading>
                {conversations &&
                  _.map(conversations, (item) => {
                    return (
                      <Box onClick={() => setCurrentChat(item)}>
                        <Conversation
                          conversation={item}
                          currentUser={_id}
                          setIsChatting={setIsChatting}
                          setChatBoxUserName={setChatBoxUserName}
                        />
                      </Box>
                    );
                  })}
              </Flex>
              {isChatting ? (
                <Flex>
                  <Messages
                    userMessages={userMessages}
                    userId={_id}
                    setMsg={setMsg}
                    sendMessages={sendMessages}
                    allUsers={allUsers}
                    chatBoxUserName={chatBoxUserName}
                    profileImg={profileImg}
                  />
                </Flex>
              ) : (
                <Flex justifyContent="center" alignItems="center" mx="16">
                  <Text fontSize="7xl" opacity="0.7">
                    Click on Chat Tab To Start Chat
                  </Text>
                </Flex>
              )}
              <Flex
                direction="column"
                gridGap="4"
                alignItems="baseline"
                bgColor="#00BFFF"
                px={allUsers && allUsers.length < 1 ? "10" : "8"}
                justifyContent="start"
              >
                <Heading as={"span"} fontSize="2xl" mt="4">
                  All Register Users
                </Heading>
                {allUsers &&
                  allUsers.map((item) => {
                    return item._id !== _id &&
                      !_.includes(filterUsers, item._id) ? (
                      <ShowUsers allUsers={item} starChat={starChat} />
                    ) : (
                      ""
                    );
                  })}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Logout isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default HomePage;
