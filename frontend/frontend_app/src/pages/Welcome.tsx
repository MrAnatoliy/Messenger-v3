import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import {
  Alert,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Input,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { LuEye, LuEyeOff, LuLogIn, LuUserPlus } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { userStore } from "@/store/storeInstances";
import { useNavigate } from "react-router-dom";
import { ContactStatus } from "@/store/userStore";

// Create a motion-enhanced version of the Alert component.
const MotionAlert = motion(Alert.Root);

export default function Welcome() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [email, setEmail] = useState(""); // New state for email
  const [errorText, setErrorText] = useState("");

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Shared logic after successful login or registration
  const handleAuthSuccess = async (token: string) => {
    userStore.setUserToken(token);

    try {
      // Fetch user data using the token
      const user_data = await axios.get(
        "http://localhost:80/api/v1/secure/user/user_data",
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        }
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userStore.setUserData(user_data.data["id"], user_data.data["username"]);
      userStore.setContacts(user_data.data["contacts"]);

      // Open WebSocket connection to the messages endpoint
      const wsUrl = `ws://localhost:80/api/v1/message/ws?token=${encodeURIComponent(
        userStore.token
      )}`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("WebSocket connection established.");
      };

      socket.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        // Parse the incoming JSON string to an object
        const data = JSON.parse(event.data);

        if(data["type"] === "active_users_update") {
            userStore.contacts.forEach(contact => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                if(data["active_users"].find((id => contact.contact_id === id.toString()))){
                    userStore.setContactStatus(contact.contact_id, ContactStatus.online)
                } else {
                    userStore.setContactStatus(contact.contact_id, ContactStatus.offline)
                }
            })
        } else {
            const message_sender_id = data["sender_id"];
            const message = data["message"];
            const message_timestamp = data["timestamp"];

            const newMessage = {
            sender_id: message_sender_id,
            message_text: message,
            timestamp: message_timestamp,
            };

            // Find the contact and push the new message
            const contact = userStore.contacts.find(
            (contact) => contact.contact_id === message_sender_id
            );
            if (contact) {
            contact.messages.push(newMessage);
            }

            const sender_name = userStore.contacts.find(contact => contact.contact_id === message_sender_id)?.contact_name || "?"

            // If the active chat isn't the sender or the document is hidden, send a web push notification
            if (
            userStore.activeContact?.contact_id !== message_sender_id ||
            document.visibilityState !== "visible"
            ) {
            // Check notification permission

            const iconPath = sender_name.match(/[a-zA-Z]/) 
                ? `/src/assets/icons/${sender_name.charAt(0).toLowerCase()}.png`
                : '/src/assets/icons/person.png';
            
            if (Notification.permission === "granted") {
                new Notification(`From : ${sender_name}`, {
                body: message,
                icon: iconPath, // Replace with your icon path
                });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification(`From : ${sender_name}`, {
                    body: message,
                    icon: iconPath,
                    });
                }
                });
            }
            }
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      userStore.setSocket(socket);

      navigate("/home");
    } catch (error) {
      setErrorText(`Failed to fetch user data: ${error}`);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorText("");

      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(
        "http://localhost:80/api/v1/auth/token",
        formData, // Sending JSON object
        {
          headers: {
            "Content-Type": "multipart/form-data", // Content-Type for JSON
          },
        }
      );

      const token = response.data["access_token"];
      await handleAuthSuccess(token); // Use shared function to handle login success
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        setErrorText(error.response.data.detail || "An error occurred.");
      } else {
        setErrorText(`Internal server error : ${error}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorText("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      setErrorText("");

      const requestBody = {
        email: email, // email field
        username: username, // username field
        password: password, // password field
      };

      const response = await axios.post(
        "http://localhost:80/api/v1/auth/register", 
        requestBody, // Sending JSON object
        {
          headers: {
            "Content-Type": "application/json", // Content-Type for JSON
          },
        }
      );

      const token = response.data["access_token"];
      await handleAuthSuccess(token); // Use shared function to handle registration success
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        setErrorText(error.response.data.detail || "An error occurred.");
      } else {
        setErrorText(`Internal server error : ${error}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              _selected={{ bg: "lightBrand", color: "bgSimple" }}
              _focus={{ bg: "lightBrand", color: "bgSimple" }}
            >
              <LuLogIn />
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
              _selected={{ bg: "lightBrand", color: "bgSimple" }}
              _focus={{ bg: "lightBrand", color: "bgSimple" }}
            >
              <LuUserPlus />
              Register
            </Tabs.Trigger>
          </Tabs.List>

          {/* Login Form */}
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
              <AnimatePresence>
                {errorText !== "" && (
                  <MotionAlert
                    key="alert"
                    status="error"
                    bg="red.800"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    mb="4"
                  >
                    <Alert.Indicator color="red.300" />
                    <Alert.Content>
                      <Alert.Title color="red.300">Auth error</Alert.Title>
                      <Alert.Description color="red.400">
                        {errorText}
                      </Alert.Description>
                    </Alert.Content>
                  </MotionAlert>
                )}
              </AnimatePresence>
              <Field label="username" color="darkBrand">
                <Input
                  type="username"
                  color="mediumBrand"
                  borderColor="lightBrand"
                  _focus={{ borderColor: "mediumBrand" }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>
              <Field label="password" pt="4" color="darkBrand">
                <InputGroup
                  w="100%"
                  flex="1"
                  endElement={
                    <Button
                      variant="plain"
                      color="darkBrand"
                      _hover={{ color: "mediumBrand" }}
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <LuEyeOff /> : <LuEye />}
                    </Button>
                  }
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    color="mediumBrand"
                    borderColor="lightBrand"
                    _focus={{ borderColor: "mediumBrand" }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
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
                    bg: "darkBrand",
                    color: "bgSimple",
                  }}
                  _hover={{
                    color: "darkBrand",
                  }}
                  onClick={handleLogin}
                  loading={isLoading}
                >
                  Login
                </Button>
              </Center>
            </Box>
          </Tabs.Content>

          {/* Register Form */}
          <Tabs.Content value="register" p="0" m="0">
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
              <AnimatePresence>
                {errorText !== "" && (
                  <MotionAlert
                    key="alert"
                    status="error"
                    bg="red.800"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    mb="4"
                  >
                    <Alert.Indicator color="red.300" />
                    <Alert.Content>
                      <Alert.Title color="red.300">Registration error</Alert.Title>
                      <Alert.Description color="red.400">
                        {errorText}
                      </Alert.Description>
                    </Alert.Content>
                  </MotionAlert>
                )}
              </AnimatePresence>
              <Field label="email" color="darkBrand">
                <Input
                  type="email"
                  color="mediumBrand"
                  borderColor="lightBrand"
                  _focus={{ borderColor: "mediumBrand" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field label="username" color="darkBrand">
                <Input
                  type="username"
                  color="mediumBrand"
                  borderColor="lightBrand"
                  _focus={{ borderColor: "mediumBrand" }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>
              <Field label="password" pt="4" color="darkBrand">
                <InputGroup
                  w="100%"
                  flex="1"
                  endElement={
                    <Button
                      variant="plain"
                      color="darkBrand"
                      _hover={{ color: "mediumBrand" }}
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <LuEyeOff /> : <LuEye />}
                    </Button>
                  }
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    color="mediumBrand"
                    borderColor="lightBrand"
                    _focus={{ borderColor: "mediumBrand" }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </Field>
              <Field label="confirm password" pt="4" color="darkBrand">
                <Input
                  type="password"
                  color="mediumBrand"
                  borderColor="lightBrand"
                  _focus={{ borderColor: "mediumBrand" }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Field>
              <Center>
                <Button
                  mt="12"
                  w="45%"
                  borderRadius="lg"
                  bg="lightBrand"
                  color="bgSimple"
                  _active={{
                    bg: "darkBrand",
                    color: "bgSimple",
                  }}
                  _hover={{
                    color: "darkBrand",
                  }}
                  onClick={handleRegister}
                  loading={isLoading}
                >
                  Register
                </Button>
              </Center>
            </Box>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
      <VStack>
        <Heading
          fontSize="6xl"
          fontFamily="Lexend Zetta"
          color="lightBrand"
          pb="1.5rem"
        >
          MESSENGER
        </Heading>
        <Heading
          fontSize="lg"
          fontFamily="Lexend"
          fontWeight="light"
          color="lightBrand"
        >
          keep it simple
        </Heading>
      </VStack>
    </HStack>
  );
}
