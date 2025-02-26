import { VStack } from "@chakra-ui/react";
import ChatCard from "./chatCard";
import { userStore } from "@/store/storeInstances";
import { observer } from "mobx-react-lite";
import { ContactStatus } from "@/store/userStore";

export const ChatList = observer(() => {
  return (
    <VStack w="100%">
      {userStore.contacts.flat().map((contact) => {
        const lastMessage = contact.messages.length > 0 ? contact.messages[contact.messages.length - 1] : null;
        const lastMessageSenderName = lastMessage
          ? lastMessage.sender_id === userStore.id
            ? "Me"
            : userStore.contacts.find(
                (other) => other.contact_id === lastMessage.sender_id
              )?.contact_name || "?"
          : "No messages";

        return (
          <ChatCard
            key={contact.contact_name}
            username={contact.contact_name}
            id={contact.contact_id}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            status={
                contact.contact_status === ContactStatus.offline ? "offline" : "online"
            }
            last_message_sender_name={lastMessageSenderName}
            last_message={lastMessage ? lastMessage.message_text || "" : ""}
            is_active={false}
          />
        );
      })}
    </VStack>
  );
});
