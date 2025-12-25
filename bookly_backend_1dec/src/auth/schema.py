
from pydantic import BaseModel,Field
from datetime import datetime
from typing import List
from src.books.schema import BookCreateModel,Book
from src.reviews.schema import ReviewModel

class UserCreateModel(BaseModel):
    username : str = Field(max_length = 8)
    email : str = Field(max_length=40)
    password1 : str = Field(min_length=6)
    first_name: str =Field(max_length=40)
    last_name: str = Field(max_length=40)

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