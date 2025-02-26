import React, { useEffect, useRef } from "react";
import { Box, EmptyState, VStack } from "@chakra-ui/react";
import Message from "./message";
import { userStore } from "@/store/storeInstances";
import { LuMousePointer2 } from "react-icons/lu";
import { observer } from "mobx-react-lite";

const ChatArea = observer(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [userStore.activeContact?.messages.length]); // re-run when messages length changes

  return (
    <Box
      ref={containerRef}
      w="100%"
      h="100%"
      overflowY="auto" // enables vertical scrolling when content overflows
      display="flex"
      flexDirection="column"
      css={{
        "&::-webkit-scrollbar": {
          width: "16px",
        },
        "&::-webkit-scrollbar-track": {
          background: "bgSimple",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "darkBrand",
          borderRadius: "none",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "lightBrand",
        },
        "&:focus::-webkit-scrollbar-thumb": {
          background: "mediumBrand",
        },
      }}
    >
      {userStore.activeContact ? (
        <>
          {userStore.activeContact.messages.map((message) => {
            // Append "Z" to ensure it's treated as UTC if needed.
            const formattedTime = new Date(message.timestamp + "Z").toLocaleTimeString("ru-EU", {
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <Message
                key={message.timestamp}
                status="viewed"
                sended={message.sender_id === userStore.id}
                text={message.message_text}
                time={formattedTime}
              />
            );
          })}
        </>
      ) : (
        <EmptyState.Root
          display="flex"
          h="100%"
          alignItems="center"
          justifyContent="center"
        >
          <EmptyState.Content>
            <EmptyState.Indicator color="lightBrand">
              <LuMousePointer2 />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title color="mediumBrand" fontSize="4xl">
                No active chat
              </EmptyState.Title>
              <EmptyState.Description color="lightBrand">
                Select chat from your contact and start messaging :)
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      )}
    </Box>
  );
});

export default ChatArea;
