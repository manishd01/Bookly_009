from pydantic import BaseModel
from datetime import date,datetime
from src.reviews.schema import ReviewModel
from typing import List
from src.tags.schema import TagModel
class Book(BaseModel):
    uid: str
    title: str
    author: str
    publish_date: date
    genre: str
    pages: int
    isbn: str
    created_at : datetime
    updated_at: datetime

    # model_config = {
    #     "from_attributes": True
    # }
 
class BookModelReviews(Book):
    reviews :  List[ReviewModel]

class BookFullDetails(BookModelReviews):
    tags : List[TagModel]


class BookCreateModel(BaseModel):
    title: str
    author: str
    genre: str
    publish_date: date
    pages: int
    isbn: str

class BookUpdateModel(BaseModel):
    title: str
    author: str
    genre: str
    pages: int
    isbn: str

