
from sqlmodel import SQLModel, Field, Column,CHAR,TIMESTAMP, func,String, Relationship
from typing import List

from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy import Column, TIMESTAMP, func,ForeignKey
import sqlalchemy.dialects.mssql as pg
from datetime import datetime,date
import uuid
from typing import Optional
# from src.auth import models

# from sqlalchemy.dialects.mysql as pg
class User (SQLModel, table = True):
    __tablename__= 'users'
    uid: str = Field(
        sa_column=Column(
            CHAR(36),
            primary_key=True,
            default=lambda: str(uuid.uuid4()),
            nullable=False
        )
    )
    username :str =Field( sa_column= Column(String(255), nullable=False, unique=True))
    email : str 
    first_name : str
    last_name : str
    role : str = Field(sa_column=Column(
        String(255), nullable=False, server_default="user"
    ))
    is_verified : bool = Field(default=False)
    password_hash :str =Field(exclude = True)
    created_at: datetime = Field(
        sa_column=Column(
            TIMESTAMP, 
            nullable=False,
            server_default=func.now()
        )
    )

    updated_at: datetime = Field(
        sa_column=Column(
            TIMESTAMP,
            nullable=False,
            server_default=func.now(),
            onupdate=func.now()
        )
    )
    books : List["Book"] = Relationship(  back_populates= "user",
                                sa_relationship_kwargs={"lazy" : "selectin"})  # # list of books added by curretn user:

    reviews : List["Reviews"] = Relationship(  back_populates= "user",
                                sa_relationship_kwargs={"lazy" : "selectin"})  # list of reviews added by curretn user:

    def __repr__(self):
        return f'<User {self.username}>'
    

# In a many-to-many relationship:
# A book can have many tags (e.g., "Fantasy", "Adventure").
# A tag can belong to many books (e.g., the tag "Fantasy" could be used for 10 different books).
# You cannot represent this with just two tables (Book, Tag).
# You need a third table — called a link table or association table — to hold the connections.

class BookTag(SQLModel, table = True):
    book_id : str = Field (
        sa_column= Column(
            CHAR(36),
            ForeignKey("books.uid"),
            primary_key=True
        )
    )
    tag_id : str = Field (
        sa_column= Column(
            CHAR(36),
            ForeignKey("tags.uid"),
            primary_key=True
        )
    )

class Tag(SQLModel,table=True):
    __tablename__="tags"
    uid : str = Field(
        sa_column=Column(
            CHAR(36),
            primary_key=True,
            default=lambda: str(uuid.uuid4()),
            nullable=False
        )
    )
    
    name : str = Column(String(255), nullable=False)
    created_at: datetime = Field(
        sa_column=Column(
            TIMESTAMP,
            server_default=func.now(),
            nullable=False
        )
    )


    books : List ["Book"] = Relationship(
        back_populates="tags",
        link_model=BookTag,
        sa_relationship_kwargs={"lazy":"selectin"}
    )
    
    def __repr__(self):
        return f"<Tag {self.name}>"







class Book(SQLModel, table=True):
    __tablename__ = "books"

    # uid: uuid.UUID = Field (
    #     sa_column = Column(
    #         # pg.UNIQUEIDENTIFIER, #UUID in postgresql ---- not working
    #         BINARY(16),
    #         nullable=False,
    #         primary_key=True,
    #         default=uuid.uuid4
    #     )
    # )
    uid: str = Field(
        sa_column=Column(
            CHAR(36),
            primary_key=True,
            default=lambda: str(uuid.uuid4()),
            nullable=False
        )
    )
    title: str
    author: str
    publish_date: date
    genre: str
    pages: int
    isbn: str
    user_uid: Optional[str] = Field(
        default=None,
        sa_column=Column(
            CHAR(36),
            ForeignKey("users.uid"),
            nullable=True
        )
    )
    # created_at:datetime = Field(Column(pg.TIMESTAMP, default=datetime.now))
    # created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now)) //pg(postgres) not using,, using mysql
    # updated_at:datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    created_at: datetime = Field(
        sa_column=Column(
            TIMESTAMP,
            server_default=func.now(),
            nullable=False
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            TIMESTAMP,
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False
        )
    )
    user : Optional["User"] = Relationship(  back_populates= "books")  #this book added by whcih user, only single user:
    reviews : List["Reviews"] = Relationship(  back_populates= "book",
                                sa_relationship_kwargs={"lazy" : "selectin"})  # list of reviews added to which book:

    tags : List[Tag] = Relationship(
        link_model=BookTag,
        back_populates = "books",
        sa_relationship_kwargs={"lazy":"selectin"},
    )

    def __repr__(self):
        return f'<BOOK -> {self.title}>'



class Reviews(SQLModel, table=True):
    __tablename__ = "reviews"
    uid: str = Field(
        sa_column=Column(
            CHAR(36),
            primary_key=True,
            default=lambda: str(uuid.uuid4()),
            nullable=False
        )
    )
    rating : int = Field(lt=6)
    review_text : str
    user_uid: Optional[str] = Field(
        default=None,
        sa_column=Column(
            CHAR(36),
            ForeignKey("users.uid"),
            nullable=True
        )
    )
    book_uid: Optional[str] = Field(
        default=None,
        sa_column=Column(
            CHAR(36),
            ForeignKey("books.uid"),
            nullable=True
        )
    )
    created_at: datetime = Field(
        sa_column=Column(
            TIMESTAMP,
            server_default=func.now(),
            nullable=False
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            TIMESTAMP,
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False
        )
    )
    user : Optional["User"] = Relationship(  back_populates= "reviews")  # review put by which user
    book : Optional["Book"] = Relationship(  back_populates= "reviews")   # review for which book



    def __repr__(self):
        return f'<Reviewfor book {self.book_uid} by user {self. user_uid}>'
    