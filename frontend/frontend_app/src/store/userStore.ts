import { makeObservable, observable, action } from "mobx";

export interface Message {
  sender_id: string;
  message_text: string;
  timestamp: string;
}

export enum ContactStatus {
    online,
    offline
}

export interface Contact {
  contact_id: string;
  contact_name: string;
  contact_status: ContactStatus;
  messages: Message[];
}

export class UserStore {
  id: string = '';
  username: string = '';
  token: string = '';
  contacts: Contact[] = [];
  activeContact: Contact | null = null;
  socket: WebSocket | null = null; // New property for storing the WebSocket

  constructor() {
    makeObservable(this, {
      id: observable,
      username: observable,
      token: observable,
      contacts: observable,
      activeContact: observable,
      socket: observable, // observe the socket property
      setUserToken: action,
      setUserData: action,
      setContacts: action,
      setContactStatus: action,
      addContact: action,
      setActiveContact: action,
      setSocket: action, // new action for setting the socket
    });
  }

  setUserToken(token: string): void {
    this.token = token;
  }

  setUserData(id: string, username: string): void {
    this.id = id;
    this.username = username;
  }

  setContacts(contacts: Contact[]): void {
    this.contacts = contacts;
  }

  setContactStatus(contact_id: string, new_status: ContactStatus): void {
    const contact = this.contacts.find(contact => contact.contact_id === contact_id)
    if(contact){
        contact.contact_status = new_status
    }
  }

  addContact(contact: Contact): void {
    this.contacts.push(contact);
  }

  setActiveContact(contactId: string): void {
    this.activeContact = this.contacts.find(
      contact => contact.contact_id === contactId
    ) || null;
  }

  // New method to set the WebSocket connection
  setSocket(socket: WebSocket | null): void {
    this.socket = socket;
  }
}
