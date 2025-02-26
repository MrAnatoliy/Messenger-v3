import { userStore } from "@/store/storeInstances";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React from "react";

type Status = "online" | "offline" | "invisible" | "not here";

interface ChatCardProps {
    id: string;
    username: string;
    status: Status;
    last_message_sender_name : string;
    last_message: string;
    is_active: boolean;
}

const get_status_color = (status: Status) => {
    const color_map = {
        "online": "#95DE4D",
        "offline": "#E14545",
        "invisible": "lightBrand",
        "not here": "#E1BD45"
    }

    return color_map[status]
}

const ChatCard: React.FC<ChatCardProps> = observer(({id, username, status, last_message_sender_name, last_message, is_active}) => {

    const on_click = () => {
        userStore.setActiveContact(id)
    }

    return(
        <Box
            display="flex"
            justifyContent="center"
            w="100%"
            bg={
                is_active ? "#1F2425" : ""
            }
        >
            <Box
                as="button"
                className="group"
                textAlign="left"
                w="85%"
                py="2"
                onClick={ on_click }
                _hover={{
                    cursor: "pointer",
                }}
            >
                <Flex position="relative" justify="space-between" alignItems="center">
                    <Heading
                        color="mediumBrand"
                        fontWeight="bold"
                        _hover={{
                            color: "darkBrand"
                        }}

                        _groupHover={{
                            color: "darkBrand"
                        }}
                    >{username}</Heading>
                    <Box flex="1" h="0" mx="2" w="" borderTop="solid 1px" borderColor="darkBrand"></Box>
                    <Box w="16px" h="16px" mr="1" borderRadius="100%" bg={get_status_color(status)}></Box>
                    <Text w="max-content" color="lightBrand" fontWeight="200">{status}</Text>
                </Flex>
                <Flex>
                <Text fontSize="sm" lineClamp={2}>
                    <Text as="span" color="darkBrand">
                        {last_message_sender_name}
                    </Text>
                    <Text as="span" color="lightBrand">
                        {" : "}{last_message}
                    </Text>
                </Text>
                </Flex>
            </Box>
        </Box>
    );
});

export default ChatCard