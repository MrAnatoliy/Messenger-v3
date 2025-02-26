from pydantic import BaseModel

class Contact(BaseModel):
    contact_id: str
    contact_name: str
    messages: list

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    contacts: list[Contact]