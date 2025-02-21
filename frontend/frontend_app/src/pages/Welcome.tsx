import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { Box, Button, Center, Heading, HStack, Input, Tabs, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { LuEye, LuEyeOff, LuLogIn, LuUserPlus } from "react-icons/lu";



export default function Welcome() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                            disabled

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
                                <InputGroup w="100%" flex="1" endElement={<Button variant="plain" color="darkBrand" _hover={{ color: "mediumBrand"}} onClick={togglePasswordVisibility}>{showPassword ? <LuEyeOff /> : <LuEye />}</Button>} >
                                    <Input type={showPassword ? "text" : "password"} color="mediumBrand" borderColor="lightBrand" _focus={{ borderColor: "mediumBrand"}}/>
                                </InputGroup>
                            </Field>
                            <Center>
                            <Button
                                mt="12"
                                w="45%"
                                borderRadius="lg"
                                bg="lightBrand"
                                color="bgSimple"
                                _active={{
                                    bg: "darkBrand"
                                }}
                                >Login</Button>
                            </Center>
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