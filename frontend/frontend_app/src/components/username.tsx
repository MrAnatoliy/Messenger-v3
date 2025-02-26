import { userStore } from "@/store/storeInstances";
import { Center, Heading } from "@chakra-ui/react";

export function Username() {

    return(
        <Center h="100%">
            <Heading fontSize="3xl" color="mediumBrand">{userStore.username}</Heading>
        </Center>
    )
}