from datetime import datetime
from pydantic import BaseModel
from typing import List

class TagModel(BaseModel):
    uid : str
    name : str
    created_at : datetime
    # class Config:
    #     orm_mode = True  # <-- enables ORM compatibility


class TagCreateModel(BaseModel):
    name :  str

class TagAddModel(BaseModel):
    tags : List[TagCreateModel]