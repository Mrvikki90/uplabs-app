import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  Image,
  Input,
  Text,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { Scrollbars } from "react-custom-scrollbars-2";
import moment from "moment/moment";
import { Badge, message } from "antd";
import axios from "axios";
import { io } from "socket.io-client";

const Messages = ({ isChatting, chatName, chatData, userId, user }) => {
  const [userMessages, setMessages] = useState([]);
  const [msg, setMsg] = useState();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [socket, setSocket] = useState();

  useEffect(() => {
    setSocket(io("http://localhost:8000/"));
    if (socket) {
      socket.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });
    }
  }, [chatData]);

  useEffect(() => {
    arrivalMessage &&
      chatData?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, chatData]);

  useEffect(() => {
    if (socket) {
      socket.emit("addUser", userId);
      socket.on("getUsers", (users) => {
        console.log("users", users);
      });
    }
  }, [socket]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios(
          `http://localhost:8000/messages/${chatData._id}`
        );
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [chatData]);

  console.log(chatData);

  const sendMessages = async () => {
    const message = {
      conversationId: chatData._id,
      sender: userId,
      text: msg,
    };

    const receiverId = chatData.members.find((m) => m !== userId);

    if (socket) {
      socket.emit("sendMessage", {
        senderId: userId,
        receiverId: receiverId,
        text: msg,
      });
    }

    try {
      const res = await axios.post("http://localhost:8000/messages", message);
      setMessages([...userMessages, res.data]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex bg="white" direction="column" justifyContent="space-between">
      <Flex ml="6" mt="4" direction="column" alignItems="baseline">
        <Heading fontSize="2xl">{chatName}</Heading>
        <Flex alignItems="center" gap="2">
          <Badge color="green" />
          <Text color="gray" fontSize="xs">
            Active
          </Text>
        </Flex>
        <Divider width="90vh" m="2" borderColor="gray" />
      </Flex>
      <Scrollbars
        style={{
          marginTop: 20,
          marginLeft: 30,
          width: 670,
          height: 500,
          overflow: "hidden",
        }}
      >
        {userMessages &&
          userMessages?.map((item) => {
            return userId === item.sender ? (
              <Flex justifyContent="flex-end" m="6">
                <div className="div-right">
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text fontStyle="italic" fontWeight="medium">
                      {moment(item.createdAt).fromNow()}
                    </Text>
                  </Flex>
                  <Text>{item.text}</Text>
                </div>
              </Flex>
            ) : (
              <Flex mt="4" justifyContent="flex-start">
                <div className="div-left">
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text fontStyle="italic" fontWeight="medium">
                      {moment(item.createdAt).fromNow()}
                    </Text>
                  </Flex>
                  <Text>{item.text}</Text>
                </div>
              </Flex>
            );
          })}
      </Scrollbars>
      <Flex mx="28" h="-webkit-fit-content" direction="column" mb="4">
        <Flex>
          <FormControl>
            <Input
              placeholder="Enter message"
              onChange={(e) => setMsg(e.target.value)}
            />
          </FormControl>
          <Button
            colorScheme="facebook"
            bg="cyan"
            variant="outline"
            onClick={sendMessages}
          >
            Send
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Messages;
