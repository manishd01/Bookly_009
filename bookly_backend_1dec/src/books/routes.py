from debugpy.adapter import access_token
from fastapi import APIRouter,status, Depends
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession
from src.books.service import BookService
from fastapi.exceptions import HTTPException

from .bookData import books
from .schema import Book, BookUpdateModel, BookCreateModel, BookModelReviews, BookFullDetails
from src.db.main import get_session
from src.auth.dependencies import AccessTokenBearer, RoleChecker
# from ..auth.routes import role_checker
from src.errors import BookNotFound


crud_R=APIRouter()
# from real DB:
book_service =  BookService()
access_token_bearer = AccessTokenBearer()
role_checker =  RoleChecker(['admin','user'])

# , _:bool = Depends(role_checker) in fucntion parameters
# ,dependencies=[Depends(role_checker)] in get/post() args(), both ways work ,,
# check next two fucntions
@crud_R.get('/' ,response_model=List[BookFullDetails]
            ,dependencies=[Depends(role_checker)])
async def get_all_books(session: AsyncSession = Depends(get_session),
                        token_details : dict = Depends(access_token_bearer)
                       ):
    books = await book_service.get_all_books(session)
    return books 

@crud_R.get('/{book_uid}', response_model =  BookFullDetails )
async def get_a_book(book_uid:str, session: AsyncSession = Depends(get_session),
                     token_details : dict = Depends(access_token_bearer)
                     , _:bool = Depends(role_checker))->Book:
    book = await book_service.get_a_book(book_uid, session)

    if book:
        # ##print(book,"ss")
        return book
    else:
        # raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        # detail="Book not found")
        raise BookNotFound()

@crud_R.get('/user/{user_uid}' ,response_model=List[BookFullDetails]
            ,dependencies=[Depends(role_checker)])
async def get_user_book_submissions(user_uid : str, session: AsyncSession = Depends(get_session),
                        token_details : dict = Depends(access_token_bearer)
                       ):

    books = await book_service.get_user_books(user_uid, session)
    return books



@crud_R.post('/',status_code=status.HTTP_201_CREATED, response_model= Book
             , dependencies = [Depends(role_checker)])
async def add_book(book_data:BookCreateModel, session: AsyncSession = Depends(get_session),
                   token_details : dict = Depends(access_token_bearer))->dict:
    user_id = token_details.get('user')['user_uid']

    new_book = await book_service.create_a_book(book_data, session, user_id)
    return new_book


# put,patch for update
@crud_R.patch('/{book_uid}')
async def update_book(book_uid:str, book_update_data:BookUpdateModel,
                      session: AsyncSession = Depends(get_session) ,
                      token_details : dict = Depends(access_token_bearer)
                      , _:bool = Depends(role_checker))-> Book:
    updated_book = await book_service.update_a_book(book_uid, book_update_data, session )
    if updated_book:
        return updated_book
    else:
        # raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        #                 detail='book not found')
        raise BookNotFound()

 
@crud_R.delete('/{book_uid}')
async def delete_book(book_uid:str, session: AsyncSession = Depends(get_session) ,
                      token_details : dict = Depends(access_token_bearer)
                      , _:bool = Depends(role_checker))-> Book:
    book_to_delete = await book_service.delete_a_book(book_uid, session )
    ##print(book_to_delete,"Ddds")
    if book_to_delete:
        return book_to_delete
    else:
        # raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        #                 detail='book not found')
        raise BookNotFound()











# from file json file:
# from .bookData import books
# @crud_R.get('/' ,response_model=List[Book])
# async def get_all_books( ):
#     return books
#
# @crud_R.get('/{book_id}')
# async def get_a_book(book_id:int)->dict:
#     for book in books:
#         if book['id']==book_id:
#             return book
#
#     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#     detail="Book not found")
#
#
# @crud_R.post('/',status_code=status.HTTP_201_CREATED)
# async def add_book(book_data:Book)->dict:
#     ##print(type(book_data),"ee") #<class 'crud_books.Book'>
#     dict_type_book= book_data.model_dump()
#     ##print(type(dict_type_book),'ss')
#     books.append(dict_type_book)
#     return dict_type_book
#
# # put,patch for update
# @crud_R.patch('/{book_id}')
# async def update_book(book_id:int, book_update_data:BookUpdateModel )-> dict:
#     ##print("ddd   ", book_update_data.title,"ddd")
#     for book in books:
#         if book['id']==book_id:
#             book['title']= book_update_data.title
#             book['author']= book_update_data.author
#             book['genre']= book_update_data.genre
#             book['pages']= book_update_data.pages
#             book['isbn']= book_update_data.isbn
#             return book
#     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                         detail='book not found')
#
#
# @crud_R.delete('/{book_id}')
# async def update_book(book_id:int )-> dict:
#     for book in books:
#         if book['id'] == book_id:
#             books.remove(book)
#             return {"msg":f"item deleted with {book_id} ID"}
#             # return {}
#     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                         detail='book not found')