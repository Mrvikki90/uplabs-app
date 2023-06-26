import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Logout = ({ onClose, isOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody px="10">
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="3xl">Are You Sure ? You Want To Logout</Text>
              <Flex gridGap="6" alignItems="center"></Flex>
            </Flex>
          </ModalBody>
          <ModalFooter gridGap="4">
            <Button rounded="full" colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
            <Button rounded="full" colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Logout;
