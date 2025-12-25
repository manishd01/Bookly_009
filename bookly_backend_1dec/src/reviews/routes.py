from fastapi import APIRouter,Depends

from src.db.model import User
from src.db.main import get_session
from .schema import ReviewCreateModel
from sqlmodel.ext.asyncio.session import AsyncSession
from .service import ReviewService
from src.auth.dependencies import get_current_user


review_service = ReviewService()
review_router = APIRouter()

@review_router.post('/book/{book_uid}')
async def add_reviews_to_book(
    book_uid: str,
    review_data : ReviewCreateModel,
    current_user : User = Depends( get_current_user),
    session :  AsyncSession = Depends(get_session)
):
    print(review_data,"review data in route")
    new_review =await review_service.add_review_to_book(user_email=current_user.email,
                                                        book_uid =  book_uid,
                                                        review_data=review_data,
                                                        session=session)
    
    return new_review


@review_router.get('/book/{book_uid}')
async def get_reviews_for_book(
    book_uid: str,
    session: AsyncSession = Depends(get_session)
):
    reviews = await review_service.get_reviews_by_book(
        book_uid=book_uid,
        session=session
    )
    return reviews