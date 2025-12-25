from fastapi import APIRouter, Depends, status
from src.auth.dependencies import RoleChecker
from typing import List
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.main import get_session
from .schema import TagAddModel, TagCreateModel, TagModel
from .services import TagService
from src.books.schema import BookFullDetails
from src.db.model import User
from src.auth.dependencies import get_current_user

tags_router =  APIRouter()
user_role_checker = Depends(RoleChecker(['user', 'admin']))
tag_service = TagService()

@tags_router.get("/", response_model=List[TagModel], dependencies=[user_role_checker])
async def get_all_tags( session : AsyncSession = Depends(get_session)):
    tags = await tag_service.get_tags(session)
    return tags

# @tags_router.get(  "/",  response_model=List[TagModel],
#     dependencies=[user_role_checker],)
# async def get_my_tags(
#     current_user: User = Depends(get_current_user),
#     session: AsyncSession = Depends(get_session),
# ):
#     return await tag_service.get_tags_by_user(
#         user_uid=current_user.uid,
#         session=session,
#     )

@tags_router.post("/", response_model= TagModel, status_code = status.HTTP_201_CREATED,
                  dependencies = [user_role_checker],)
async def add_tag(tag_data :  TagCreateModel, session :  AsyncSession = Depends(get_session)):
    tag_added= await tag_service.add_tag(tag_data, session=session)
    return tag_added

# //imp
# //sent tags: in body         {
#   "tags": [
#     {"name": "python2"},
#     {"name": "fastap22i"}
#   ]
# }
@tags_router.post('/book/{book_uid}', response_model= BookFullDetails , dependencies=[user_role_checker])
async def add_tags_to_book(book_uid: str, tag_data : TagCreateModel, session : AsyncSession = Depends(get_session)):
    print(tag_data, "tag data in route")
    book_with_tag =  await tag_service.add_tags_to_Book( book_uid=book_uid, tag_data=tag_data, session=session)
    #print("running.....")
    return book_with_tag

@tags_router.put("/{tag_uid}", response_model= TagModel, dependencies= [user_role_checker])
async def update_tag(tag_uid : str, tag_update_data : TagCreateModel ,
                     session : AsyncSession = Depends(get_session)):
    updated_tag = await tag_service.update_tag(tag_uid, tag_update_data, session)
    return updated_tag

@tags_router.delete("/{tag_uid}", status_code=status.HTTP_204_NO_CONTENT,
                    dependencies=[user_role_checker])
async def delete_tag(tag_uid: str, session : AsyncSession = Depends(get_session)):
    print("deleting tag....,inside route")
    update_tag = await tag_service.delete_tag(tag_uid, session)
    return update_tag

@tags_router.get(
    "/{book_uid}/tags",
    response_model=list[TagModel],
    dependencies=[user_role_checker],
)
async def get_tags_by_book(
    book_uid: str,
    session: AsyncSession = Depends(get_session),
):
    return await tag_service.get_tags_by_book(
        book_uid=book_uid,
        session=session,
    )

    

