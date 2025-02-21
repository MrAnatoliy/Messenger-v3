import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { Box, Button, Heading, HStack, Input, Tabs, VStack } from "@chakra-ui/react";
import { LuEye, LuLogIn, LuUserPlus } from "react-icons/lu";



export default function Welcome() {
    return(
        <HStack justify="space-evenly" h="vh">
            <Box w="25%">
                <Tabs.Root defaultValue="login" variant="subtle">
                    <Tabs.List w="100%">
                        <Tabs.Trigger 
                            value="login"
                            w="50%"
                            borderRadius="none" 
                            borderTopLeftRadius="2xl"
                            color="mediumBrand"
                            borderWidth="1px"
                            borderColor="lightBrand"
                            justifyContent="center"
                            _active={{ bg: "mediumBrand", color: "bgSimple" }} 
                            _selected={{ bg: "lightBrand", color: "bgSimple"}} 
                            _focus={{ bg: "lightBrand", color: "bgSimple"}}
                        >
                            <LuLogIn/>
                            Login
                        </Tabs.Trigger>
                        <Tabs.Trigger 
                            value="register"
                            w="50%"
                            borderRadius="none" 
                            borderTopRightRadius="2xl" 
                            color="mediumBrand"
                            borderWidth="1px"
                            borderColor="lightBrand"
                            justifyContent="center"
                            _active={{ bg: "mediumBrand", color: "bgSimple" }} 
                            _selected={{ bg: "lightBrand", color: "bgSimple"}} 
                            _focus={{ bg: "lightBrand", color: "bgSimple"}}
                        >
                            <LuUserPlus/>
                            Register
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="login" p="0" m="0">
                        <Box
                            borderTop="none"
                            borderWidth="1px"
                            borderColor="lightBrand"
                            paddingLeft="4"
                            paddingRight="4"
                            paddingTop="6"
                            paddingBottom="6"
                            borderBottomRadius="2xl"
                        >
                            <Field label="username" color="darkBrand">
                                <Input color="mediumBrand" borderColor="lightBrand" _focus={{ borderColor: "mediumBrand"}}/>
                            </Field>
                            <Field label="password" pt="4" color="darkBrand">
                                <InputGroup w="100%" flex="1" endElement={<Button variant="plain" color="darkBrand" _hover={{ color: "mediumBrand"}}><LuEye/></Button>} >
                                    <Input type="password" color="mediumBrand" borderColor="lightBrand" _focus={{ borderColor: "mediumBrand"}}/>
                                </InputGroup>
                            </Field>
                        </Box>
                    </Tabs.Content>
                    <Tabs.Content value="register">Register Form</Tabs.Content>
                </Tabs.Root>
            </Box>
            <VStack>
                <Heading fontSize="6xl" fontFamily="Lexend Zetta" color="lightBrand" pb="1.5rem">MESSENGER</Heading>
                <Heading fontSize="lg" fontFamily="Lexend" fontWeight="light" color="lightBrand">keep it simple</Heading>
            </VStack>
        </HStack>
    )
}