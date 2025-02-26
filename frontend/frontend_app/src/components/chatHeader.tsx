import { userStore } from "@/store/storeInstances";
import { Box, Heading, IconButton } from "@chakra-ui/react";
import { LuMenu } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";

const MotionBox = motion(Box);

const ChatHeader = observer(() => {
  return (
    <AnimatePresence>
      {userStore.activeContact && (
        <MotionBox
          key="chat-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          w="100%"
          h="100%"
          px="4"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading fontSize="2xl" color="mediumBrand">
            {userStore.activeContact.contact_name}
          </Heading>
          <IconButton
            color="lightBrand"
            variant="plain"
            _hover={{
              color: "bgSimple",
              bg: "lightBrand"
            }}
          >
            <LuMenu />
          </IconButton>
        </MotionBox>
      )}
    </AnimatePresence>
  );
});

export default ChatHeader;
