import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

type MessageStatus = "sending" | "sended" | "viewed";

interface MessageProps {
  status: MessageStatus;
  sended: boolean;
  text: string;
  time: string;
}

// Create a motion-enabled Box
const MotionBox = motion(Box);

const Message: React.FC<MessageProps> = ({ status, sended, text, time }) => (
  <Box
    display="flex"
    w="100%"
    justifyContent={sended ? "end" : "start"}
    flexFlow={sended ? "row-reverse" : "row"}
    alignItems="end"
    overflow="clip"
    my="4"
  >
    <MotionBox
      as={Text}
      position="relative"
      color="bgSimple"
      
      bg={sended ? "mediumBrand" : "lightBrand"}
      py="2"
      pr={sended ? "8" : "4"}
      pl={sended ? "4" : "8"}
      borderLeftRadius={sended ? "lg" : "none"}
      borderRightRadius={sended ? "none" : "lg"}
      maxWidth="50%"
      // Add sliding animation
      initial={{ x: sended ? "100%" : "-100%" }} // Start offscreen (from the side)
      animate={{ x: "0%" }} // Slide to the normal position
      transition={{ type: "spring", stiffness: 250, damping: 30 }} // Spring-based animation for smooth effect
      // When the message is still sending, animate its opacity to simulate a loading state
      {...(status === "sending" && {
        animate: { opacity: [0.3, 1, 0.3] },
        transition: { duration: 3, repeat: Infinity },
      })}
    >
      {text}
      {/* When message is delivered ("sended") and is from the sender, add a vertical stripe mark */}
      {status === "sended" && sended && (
        <Box
          position="absolute"
          left="-2px"
          top="0"
          bottom="0"
          w="10px"
          bg="darkBrand"
          zIndex="1"
        />
      )}
    </MotionBox>
    <Text
      color="darkBrand"
      fontSize="sm"
      pr={sended ? "4" : "0"}
      pl={sended ? "0" : "4"}
    >
      {time}
    </Text>
  </Box>
);

export default Message;
