import React, { useEffect, useState } from "react";
import { Flex, Text, Avatar, Divider } from "@chakra-ui/react";
import axios from "axios";

const Conversation = ({ conversation, currentUser, setChatName }) => {
  const [user, setUser] = useState();

  const getUsername = (name) => {
    setChatName(name);
  };

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser);
    const getUser = async () => {
      try {
        const res = await axios(
          "http://localhost:8000/api/getone?userId=" + friendId
        );
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <>
      <Flex direction="column" mt="4" alignItems="baseline">
        <Flex alignItems="center" gap="2">
          <Avatar
            size="sm"
            name="Dan Abrahmov"
            src="https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=2000"
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
