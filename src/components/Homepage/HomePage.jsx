import React, { useEffect, useState } from "react";
import { Flex, Avatar, Box, Heading, Text, Divider } from "@chakra-ui/react";
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

const HomePage = () => {
  const location = useLocation();
  const [isChatting, setIsChatting] = useState(true);
  const [chatName, setChatName] = useState();
  const [chatData, setChatData] = useState();

  const {
    user,
    user: { _id },
  } = location.state;
  const [userData, setDataUser] = useState();

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/conversation/${_id}`
        );

        setDataUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [location]);

  return (
    <Flex w="full">
      <Flex
        direction="column"
        alignItems="center"
        gap="12"
        h="91.5vh"
        bg="#001529"
        px="2"
        justifyContent="space-around"
      >
        <Flex>
          <Avatar
            size="lg"
            name="Dan Abrahmov"
            src="https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=2000"
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
          />
        </Flex>
      </Flex>
      <Flex
        bgColor="#e4f2f7"
        h="91.5vh"
        w="-webkit-fit-content"
        direction="column"
        alignItems="baseline"
      >
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
        {userData &&
          _.map(userData, (item) => {
            return (
              <Box onClick={() => setChatData(item)}>
                <Conversation
                  conversation={item}
                  currentUser={_id}
                  setChatName={setChatName}
                />
              </Box>
            );
          })}
      </Flex>
      <Box border="2px solid red" w="50%">
        <Messages
          isChatting={isChatting}
          chatName={chatName}
          chatData={chatData}
          userId={_id}
          user={user}
        />
      </Box>
      <Flex border="2px solid green" w="full">
        <Heading fontSize="2xl" m="4">
          Active Users
        </Heading>
      </Flex>
    </Flex>
  );
};

export default HomePage;
