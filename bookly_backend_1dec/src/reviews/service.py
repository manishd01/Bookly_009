from src.db.model import Reviews, User
from src.auth.service import UserService
from src.books.service import BookService
from sqlmodel.ext.asyncio.session import AsyncSession
from src.reviews.schema import ReviewCreateModel
from fastapi.exceptions import HTTPException 
from fastapi import status
import logging
from sqlmodel import select,desc
from ..db.model import Reviews
book_service =  BookService()
user_service = UserService()

class ReviewService:
    async def get_reviews_by_book(
        self,
        book_uid: str,
        session: AsyncSession
    ):
        statement = (
            select(
                Reviews,
                User.username
            )
            .join(User, Reviews.user_uid == User.uid)
            .where(Reviews.book_uid == book_uid)
            .order_by(Reviews.created_at.desc())
        )

        result = await session.exec(statement)
        rows = result.all()

        # 🔹 Shape response (VERY IMPORTANT)
        reviews = []
        for review, username in rows:
            reviews.append({
                "uid": review.uid,
                "review_text": review.review_text,
                "rating": review.rating,
                "created_at": review.created_at,
                "updated_at": review.updated_at,
                "book_uid": review.book_uid,
                "user": {
                    "username": username
                }
            })

        return reviews

    

    async def add_review_to_book(self, user_email :  str, book_uid: str ,
                                  review_data : ReviewCreateModel,
                                 session:  AsyncSession):
        try:
            book =  await book_service.get_a_book(
                book_uid=book_uid,
                session=session
            )
            user =  await user_service.get_user_by_email(
                email=user_email,
                session=session
            )

            # creting reiview
            review_data_dict =  review_data.model_dump()
            new_review = Reviews(
                **review_data_dict
            )

            if not book:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="book not found"
                )
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User  not found"
                )

            # //check if book and user exists or not.... before this
            new_review.user = user
            new_review.book = book
            session.add(new_review)
            await session.commit()
            return new_review

        except Exception as e:
            logging.exception(e)
            raise HTTPException(
                status_code= status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="ooppss....... somehting went wrong..."
            )   