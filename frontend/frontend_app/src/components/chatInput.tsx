import { Box, IconButton, Textarea } from "@chakra-ui/react";
import { LuSend } from "react-icons/lu";
import { userStore } from "@/store/storeInstances";
import { useState } from "react";

const ChatInput = () => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    const recipient_id = userStore.activeContact?.contact_id;
    if (!recipient_id) {
      console.error("No active contact selected.");
      return;
    }
    
    const payload = {
      recipient_id,
      message,
    };

    if (userStore.socket && userStore.socket.readyState === WebSocket.OPEN) {
      // Send the message payload over the WebSocket.
      userStore.socket.send(JSON.stringify(payload));
      
      // Create a new message object with current time (ISO string).
      const newMessage = {
        sender_id: userStore.id, // assuming userStore.id is the current user's id
        message_text: message,
        timestamp: new Date(),
      };

      // Immediately add the message to the active contact's messages
      if(userStore.activeContact){
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        userStore.activeContact.messages.push(newMessage);
      }

      // Clear the input
      setMessage("");
    } else {
      console.error("WebSocket is not open.");
    }
  };

  return (
    <Box
      w="100%"
      h="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="end"
      px="20"
      py="4"
    >
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        autoresize
        maxH="5lh"
        color="lightBrand"
        borderColor="darkBrand"
        borderRadius="lg"
        _focus={{
          borderColor: "mediumBrand",
        }}
        css={{
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "none",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "darkBrand",
            borderRadius: "lg",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "lightBrand",
          },
          "&:focus::-webkit-scrollbar-thumb": {
            background: "mediumBrand",
          },
        }}
      />
      <IconButton
        h="100%"
        ml="8"
        variant="solid"
        bg="lightBrand"
        color="bgSimple"
        borderRadius="lg"
        onClick={sendMessage}
        _hover={{
          bg: "mediumBrand",
        }}
      >
        <LuSend />
      </IconButton>
    </Box>
  );
};

export default ChatInput;
