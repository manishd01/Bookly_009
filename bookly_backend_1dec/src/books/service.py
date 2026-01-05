# crud to DB:

from sqlmodel.ext.asyncio.session import AsyncSession
from .schema import BookCreateModel,BookUpdateModel,Book
from src.db.model import Book, User
from sqlmodel import select,desc
from datetime import datetime
from fastapi import HTTPException, UploadFile
import pandas as pd

REQUIRED_COLUMNS = {
        "title",
        "author",
        "genre",
        "publish_date",
        "pages",
        "isbn"
    }
class BookService:
    async def get_all_books(self,session:AsyncSession):
        statement = (
        select(Book, User.uid, User.username, User.role)
        .join(User, User.uid == Book.user_uid)
        .where(Book.user_uid == User.uid)
        .order_by(Book.created_at.desc())
    )

        res = await session.exec(statement)

        books_with_user = []
        for row in res.all():
            book, user_uid, username, role = row
            books_with_user.append({
                "book": book,  # You can still return the full Book object
                "user": {
                    "uid": user_uid,
                    "username": username,
                    "role": role
                }
            })

        return books_with_user

    async def get_a_book(self, book_uid:str ,session:AsyncSession)->Book:
        statement = select(Book).where(Book.uid == book_uid)
        res = await session.exec(statement)
        # ##print(3/0)
        book = res.first()
        ##print(type(book))
        return book if book is not None else None

    async def get_user_books(self,user_uid, session:AsyncSession):
        ##print("inside...")
        statement = select(Book).where(Book.user_uid == user_uid).order_by(desc(Book.created_at))
        res = await session.exec(statement)
        return res.all()


    

    async def create_a_book(self, book_data: BookCreateModel ,session:AsyncSession, user_uid : str):

        book_data_dict = book_data.model_dump()  #convertiung to dict
        new_book = Book ( **book_data_dict )
        # new_book.publish_date = datetime.strptime(book_data_dict['publish_date'], "%Y-%m-%d")
        new_book.user_uid=user_uid
        # ##print(new_book,"new_book data:")
        session.add(new_book)
        await session.commit()
        await session.refresh(new_book) #newkine added
        return new_book

    async def update_a_book(self, book_uid:str, update_data: BookUpdateModel ,session:AsyncSession):
        book_to_update = await self.get_a_book(book_uid, session)
        if book_to_update is not None:
            update_data_dict = update_data.model_dump()

            for k, v in update_data_dict.items():
                setattr(book_to_update, k, v)

            await session.commit()
            await session.refresh(book_to_update)
            return book_to_update
        else:
           return None



    async def delete_a_book(self, book_uid:str ,session:AsyncSession):
        book_to_delete = await self.get_a_book(book_uid, session)

        if book_to_delete is not None:
            await session.delete(book_to_delete)
            await session.commit()
            return book_to_delete
        else:
            return None
    
    

    async def bulk_upload_books(
        self,
        file: UploadFile,
        user_uid: str,
        session: AsyncSession
    ):
        if not file.filename.endswith(".xlsx"):
            raise HTTPException(
                status_code=400,
                detail="Only .xlsx Excel files are allowed"
            )

        try:
            df = pd.read_excel(file.file)
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Invalid Excel file"
            )

        if not REQUIRED_COLUMNS.issubset(set(df.columns)):
            raise HTTPException(
                status_code=400,
                detail=f"Excel must contain columns: {REQUIRED_COLUMNS}"
            )

        success = 0
        failed = 0
        errors = []

        for idx, row in df.iterrows():
            try:
                book = Book(
                    title=str(row["title"]).strip(),
                    author=str(row["author"]).strip(),
                    genre=str(row["genre"]).strip(),
                    publish_date=row["publish_date"],
                    pages=int(row["pages"]),
                    isbn=str(row["isbn"]).strip(),
                    user_uid=user_uid
                )

                session.add(book)
                success += 1

            except Exception as e:
                failed += 1 
                errors.append({
                    "row": idx + 2,  # Excel row number
                    "error": str(e)
                })

        await session.commit()
        print("Bulk upload - success:", success, "failed:", failed, "errors:", errors)
        return {
            "success_count": success,
            "failed_count": failed,
            "errors": errors
        }