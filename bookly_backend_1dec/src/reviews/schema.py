from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ReviewModel(BaseModel):
    uid: str
    rating : int = Field(lt=6)
    review_text : str
    user_uid: Optional[str] 
    book_uid: Optional[str] 
    created_at: datetime
    updated_at: datetime 


class ReviewCreateModel(BaseModel):
    rating : int = Field(lt=6)
    review_text : str


class ReviewResponseModel(BaseModel):
    uid: str
    rating : int = Field(lt=6)
    comment: str
    user_email: str
    created_at: datetime

    class Config:
        from_attributes = True