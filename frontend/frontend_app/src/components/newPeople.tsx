import { userStore } from "@/store/storeInstances";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Text, VStack, Box, IconButton, EmptyState } from "@chakra-ui/react";
import { LuAnnoyed, LuPlus } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster"; // Import the toaster function
import { Contact, ContactStatus } from "@/store/userStore"; // Ensure the types are imported

// Define types for the API response and user structure
interface User {
    id: string;
    username: string;
}

export const NewPeople = observer(() => {
    const [people, setPeople] = useState<User[]>([]); // Use the User type for people state

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get<User[]>(
                    "http://localhost:80/api/v1/secure/user/all",
                    {
                        headers: {
                            Authorization: `Bearer ${userStore.token}`,
                        },
                    }
                );

                const filteredData = response.data.filter(
                    (person) =>
                        person.id.toString() !== userStore.id &&
                        !userStore.contacts.some(
                            (contact) => contact.contact_id === person.id.toString()
                        )
                );
                setPeople(filteredData); // Assuming the API returns an array of users
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleAddContact = (person: User) => {
        // Create a new contact object based on the selected person
        const newContact: Contact = {
            contact_id: person.id,
            contact_name: person.username,
            contact_status: ContactStatus.offline, // Set default status
            messages: [], // Initial empty messages for the new contact
        };

        // Add the new contact to the user's contacts in the store
        userStore.addContact(newContact);

        // Remove the person from the NewPeople list
        setPeople((prevPeople) => prevPeople.filter((p) => p.id !== person.id));

        // Show a success toast notification
        toaster.create({
            title: "New Contact Added",
            description: `${person.username} has been added to your contacts.`,
            duration: 3000,
            type: "success",
            placement: "bottom-end",
        });
    };

    return (
        <VStack h="100%">
            {people.length > 0 ? (
                people.map((person) => (
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        key={person.id}
                        p={4}
                        w="100%"
                    >
                        <Text fontSize="lg" fontWeight="medium" textAlign="center" color="mediumBrand">
                            {person.username}
                        </Text>
                        <IconButton
                            variant="solid"
                            bg="lightBrand"
                            color="bgSimple"
                            onClick={() => handleAddContact(person)}
                            _hover={{
                                bg: "mediumBrand",
                            }}
                        >
                            <LuPlus />
                        </IconButton>
                    </Box>
                ))
            ) : (
                <EmptyState.Root display="flex" h="100%" alignItems="center">
                    <EmptyState.Content>
                        <EmptyState.Indicator color="lightBrand">
                            <LuAnnoyed />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                            <EmptyState.Title color="lightBrand">There is no users left</EmptyState.Title>
                            <EmptyState.Description color="darkBrand">
                                Looks like you already chatting with every user in this app :o
                            </EmptyState.Description>
                        </VStack>
                    </EmptyState.Content>
                </EmptyState.Root>
            )}
        </VStack>
    );
});
