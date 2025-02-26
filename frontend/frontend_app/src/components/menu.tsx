import { Box, Tabs } from "@chakra-ui/react";
import { LuCog, LuMessageSquare, LuUserCog, LuUsers } from "react-icons/lu";
import { NewPeople } from "./newPeople";
import { ChatList } from "./chatList";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const TabTrigger = ({ value, icon, ...props }) => (
  <Tabs.Trigger
    {...props}
    color="lightBrand"
    borderLeft="solid 1px"
    borderColor="lightBrand"
    borderRadius="0"
    pl="1/2"
    pr="1/2"
    pt="6"
    pb="6"
    justifyContent="center"
    fontSize="2xl"
    value={value}
    _selected={{ bg: "lightBrand", color: "bgSimple" }}
    _active={{ bg: "mediumBrand", color: "bgSimple" }}
  >
    {icon}
  </Tabs.Trigger>
);

export function Menu() {
  return (
    <Box h="100%">
      <Tabs.Root defaultValue="chats" variant="subtle" h="100%">
        <Tabs.List
          borderWidth="1px"
          borderLeft="none"
          borderRight="none"
          borderTop="none"
          borderColor="lightBrand"
          w="100%"
          justifyContent="center"
        >
          <TabTrigger value="chats" icon={<LuMessageSquare />}/>
          <TabTrigger value="people" icon={<LuUsers />}/>
          <TabTrigger value="profile" icon={<LuUserCog />} disabled/>
          <TabTrigger value="settings" icon={<LuCog />} borderRight="solid 1px" borderLeft="solid 1px" borderColor="lightBrand" disabled/>
        </Tabs.List>
        <Tabs.Content value="chats"><ChatList/></Tabs.Content>
        <Tabs.Content value="people"><NewPeople/></Tabs.Content>
        <Tabs.Content value="profile">profile</Tabs.Content>
        <Tabs.Content value="settings">settings</Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
