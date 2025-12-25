# not oin usee;;;;;;;
#
# from fastapi import FastAPI, Header
# from typing import Optional
# from pydantic import BaseModel
# #
# # from src


#
# @app1.get('/')
# async def read_root():
#     return {"message":"tttto Fastapi"}
#
# # #
# @app1.get('/test1')
# async def test_endpoint11():
#     return {"message": "This is a testss"}

# # path parameters
# # http://127.0.0.1:8000/greet/john
# @app.get('/greet/{name}')
# async def greet_user(name:str)->dict:
#     return {"message":f"hello {name}"}

# //query par ameters

# @app.get('/greet')
# async def greet_user1(name:str)-> dict:
#     return {"message":f"hello {name}"}


# path+query=>hybrid
# http://127.0.0.1:8000/greet/john?age=22
# @app.get('/greet/{name}')
# async def greet_user1(name:str,age:int)-> dict:
#     return {"message":f"hello {name}, age:{age}"}




# using optional parameters
# http://127.0.0.1:8000/greet
# http://127.0.0.1:8000/greet?age=2
# http://127.0.0.1:8000/greet?name=eyy&eage=2
# @app1.get('/greet')
# async def greet_user1(name:Optional[str]="user",age:int=0)-> dict:
#     return {"message":f"hello {name}, age:{age}"}
#


# print(app1.routes,"ddddd")
#
#
#
# # ---------------------------------------
# class BookCreateModel(BaseModel):
#     title:str
#     author:str
#
#
# @app1.post('/create_book1')
# async def create_book(book_data:BookCreateModel):
#     return{
#         "title":book_data.title,
#         "Author":book_data.author
#     }
#
#




# -------------------------------------------------------
# @app1.get('/get_headers',status_code=500)
# async def get_headers(accept:str = Header(None),
#                       content_type:str = Header(None),
#                       user_agent:str = Header(None),
#                       host:str = Header(None)
#                       ):
#   request_headers={}
#   request_headers["accept"]=accept
#   request_headers["content-type"]=content_type
#   request_headers["user-agent"]=user_agent
#   request_headers["host-name"]=host
#   print(request_headers,"dddd")
#   return request_headers
#
# # output:{
#     "accept": "*/*",
#     "content-type": "Application/Json",
#     "user-agent": "PostmanRuntime/7.44.1",
#     "host-name": "127.0.0.1:8000"
# }



# -------------------------------------------------------
# # CRUD :
# # app1.include_router(crud_R)
# app1.include_router(crud_R)
#
#
#
#
#



















# env\Scripts\activate    venv\Scripts\activate
# uvicorn main:app1 --reload