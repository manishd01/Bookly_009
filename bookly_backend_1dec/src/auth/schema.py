
from pydantic import BaseModel,Field
from datetime import datetime
from typing import List, Literal
from src.books.schema import BookCreateModel,Book
from src.reviews.schema import ReviewModel

class UserCreateModel(BaseModel):
    username : str = Field(max_length = 40)
    email : str = Field(max_length=40)
    password1 : str = Field(min_length=6)
    first_name: str =Field(max_length=40)
    last_name: str = Field(max_length=40)
    # role : str = Field(max_length=40, default="buyer")
    role: Literal["Buyer", "Seller"] = "Buyer"

class UserModel(BaseModel):
    uid: str
    username: str
    email: str
    first_name: str
    last_name: str
    is_verified: bool
    password_hash :str =Field(exclude = True)
    created_at: datetime
    updated_at: datetime


class UserHaveBooksReviewsModel(UserModel):
    books: List[Book]
    reviews: List[ReviewModel]



class UserLoginModel(BaseModel):
    email: str = Field(max_length=40)
    password1: str = Field(min_length=6)


class EMailSchema (BaseModel):
    addresses : List[str]
    
