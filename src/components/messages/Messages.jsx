import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { Badge } from "antd";
import axios from "axios";
import moment from "moment/moment";
import React, { useEffect, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import { SERVE_STATIC_IMAGES_PATH } from "../constants/constant";

const Messages = ({
  sendMessages,
  userId,
  userMessages,
  setMsg,
  chatBoxUserName,
  profileImg,
}) => {
  const scrollRef = useRef();
  const [filterUser, setFilterUser] = useState();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios(
          "https://socket-chat-app-3v3p.onrender.com/api/getone?name=" +
            chatBoxUserName
        );
        setFilterUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [chatBoxUserName, userId]);

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [userMessages]);

  return (
    <Flex bg="white" direction="column" justifyContent="space-between">
      <Flex mt="4" direction="column" alignItems="baseline">
        <Heading fontSize="2xl">{chatBoxUserName.toUpperCase()}</Heading>
        <Flex alignItems="center" gap="2">
          <Badge color="green" />
          <Text color="gray" fontSize="xs">
            Active
          </Text>
        </Flex>
        <Divider width="120vh" m="2" borderColor="gray" />
      </Flex>
      <SimpleBar
        style={{
          width: 895,
          height: 500,
          padding: 20,
        }}
      >
        {userMessages &&
          userMessages?.map((item) => {
            return userId === item.sender ? (
              <Flex direction="column" alignItems="end" mb="6">
                <Flex direction="column" alignItems="baseline">
                  <Flex gridGap="2" alignItems="center">
                    <Box
                      w="-webkit-fit-content"
                      py="2"
                      px="4"
                      bgColor="cyan.200"
                      rounded="full"
                    >
                      <Text>{item.text}</Text>
                    </Box>
                    <Avatar
                      size="sm"
                      name="Dan Abrahmov"
                      src={`${SERVE_STATIC_IMAGES_PATH}${profileImg}`}
                    />
                  </Flex>
                  <Text fontFamily="cursive" fontStyle="italic" fontSize="xs">
                    {moment(item.createdAt).fromNow()}
                  </Text>
                </Flex>
              </Flex>
            ) : (
              <Flex direction="column" alignItems="start" mb="6">
                <Flex gridGap="2" alignItems="center">
                  <Avatar
                    size="sm"
                    name="Dan Abrahmov"
                    src={`${SERVE_STATIC_IMAGES_PATH}${filterUser?.profileImg}`}
                  />
                  <Flex direction="column">
                    <Box
                      w="-webkit-fit-content"
                      py="2"
                      px="4"
                      bgColor="yellow.300"
                      rounded="full"
                    >
                      <Text>{item.text}</Text>
                    </Box>
                    <Text fontFamily="cursive" fontStyle="italic" fontSize="xs">
                      {moment(item.createdAt).fromNow()}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            );
          })}
        <Box ref={scrollRef}></Box>
      </SimpleBar>
      <Flex direction="column">
        <Flex>
          <FormControl>
            <Input
              boxShadow="lg"
              h="14"
              rounded="0"
              placeholder="Enter message"
              onChange={(e) => setMsg(e.target.value)}
            />
          </FormControl>
          <Button
            bgColor="#1589FF"
            boxShadow="lg"
            h="14"
            variant="ghost"
            w="20"
            colorScheme="#1589FF"
            rounded="0"
            onClick={sendMessages}
          >
            <i class="fa fa-paper-plane" aria-hidden="true"></i>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Messages;
