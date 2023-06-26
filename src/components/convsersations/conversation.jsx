import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVE_STATIC_IMAGES_PATH } from "../constants/constant";

const Conversation = ({
  conversation,
  currentUser,
  setIsChatting,
  setChatBoxUserName,
}) => {
  const [user, setUser] = useState();

  const getUsername = (name) => {
    setChatBoxUserName(name);
    setIsChatting(true);
  };

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser);
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
  }, [conversation, currentUser]);

  return (
    <>
      <Flex direction="column" mt="4" alignItems="baseline">
        <Flex alignItems="center" gap="2">
          <Avatar
            size="sm"
            name="Dan Abrahmov"
            src={`${SERVE_STATIC_IMAGES_PATH}${user?.profileImg}`}
            onClick={() => getUsername(user?.name)}
            cursor="pointer"
          />
          <Text fontSize="xl">{user && user?.name}</Text>
        </Flex>
        <Text fontSize="xs">a message form this....</Text>
      </Flex>
      <Divider width="250px" m="2" borderColor="gray" />
    </>
  );
};

export default Conversation;
